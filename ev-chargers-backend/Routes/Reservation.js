const express = require("express");
const Reservation = require("../Schemas/Reservation");
const Station = require("../Schemas/Station");
const Car = require("../Schemas/Car");
const router = express.Router();
const verifyUser = require("./JWTverification/VerifyUser");
const EventLog = require("../Schemas/EventLog");

router.post("/reserveStation", verifyUser, async (req, res) => {
  let {
    Email: userEmail,
    CarID: carId,
    StationID: stationId,
    Start: start,
    End: end,
  } = req.body;

  if (!userEmail || !carId || !stationId) {
    return res.status(400).send({ message: "All fields are required" });
  }

  if (!start) start = Date.now();
  if (!end) end = start + 600000; // 10 min

  start = new Date(start);
  end = new Date(end);

  const maxDuration = 2 * 60 * 60 * 1000;
  if (end - start > maxDuration) {
    return res
      .status(400)
      .send({ message: "Reservation period cannot exceed 2 hours" });
  }

  try {
    const station = await Station.findOne({ stationId });
    if (!station) {
      return res.status(400).send({ message: "Station does not exist" });
    }

    const previousReservation = await Reservation.findOne({ userEmail });
    if (previousReservation) {
      return res
        .status(400)
        .send({ message: "User cannot have two reservations" });
    }

    const car = await Car.findOne({ carId });
    if (car.chargerType !== station.chargerType) {
      return res.status(400).send({
        message:
          "User desn't have a car with charger type " + station.chargerType,
      });
    }

    const existing = await Reservation.findOne({ stationId });
    if (existing && !(existing.start > end || existing.end < start)) {
      return res
        .status(400)
        .send({ message: "Station is already reserved for that time" });
    }

    const newReservation = new Reservation({
      userEmail,
      carId,
      stationId,
      start,
      end,
    });
    await newReservation.save();

    await EventLog.create({
      description: `Reservation created: User ${userEmail} reserved Station ${stationId} from ${start} to ${end}`,
      eventType: "reservation",
      userId: req.user.id,
      email: req.user.email,
    });

    res.status(201).json({
      reservation: newReservation,
      stationChargerPower: station.chargerPower,
    });
  } catch (err) {
    console.error("Error saving reservation:", err);
    res.status(500).send({ message: "Error saving reservation" });
  }
});

router.get("/getReservations/SelectedPeriod", verifyUser, async (req, res) => {
  const { Start: start, End: end } = req.query;

  if (!start || !end) {
    return res.status(400).send({ message: "All fields are required" });
  }
  try {
    const reservations = await Reservation.find({
      $or: [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } },
      ],
    });
    res.status(200).json({ reservations: reservations });
  } catch (err) {
    console.error("Error saving station:", err);
    res.status(500).send({ message: "Error saving station" });
  }
});

router.get("/getReservations/SelectedUser", verifyUser, async (req, res) => {
  const { Email: userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).send({ message: "User email is required" });
  }
  try {
    const reservation = await Reservation.findOne({ userEmail });
    res.status(200).json({ reservation: reservation });
  } catch (err) {
    console.error("Error saving station:", err);
    res.status(500).send({ message: "Error saving station" });
  }
});

router.put("/activateReservation", verifyUser, async (req, res) => {
  const { Email: userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).send({ message: "User email is required" });
  }

  try {
    const reservation = await Reservation.findOne({ userEmail });

    if (!reservation) {
      return res.status(404).send({ message: "Reservation not found" });
    }

    const stationId = reservation.stationId;

    const station = await Station.findOne({ stationId });

    if (!station) {
      return res.status(404).send({ message: "Station not found" });
    }

    if (reservation.end <= Date.now()) {
      Reservation.deleteOne(reservation);
      return res.status(404).send({ message: "Reservation ended" });
    }

    if (reservation.start >= Date.now()) {
      return res
        .status(400)
        .send({ message: "Reservation start time not reached." });
    }

    station.currentUserInfo = userEmail;
    station.chargerAvailability = "Occupied";
    await station.save();

    await EventLog.create({
      description: `Reservation activated: User ${userEmail} activated Station ${stationId}`,
      eventType: "reservation",
      userId: req.user.id,
      email: req.user.email,
    });

    res.status(200).send({ message: "Reservation activated" });
  } catch (err) {
    console.error("Error activating reservation:", err);
    res.status(500).send({ message: "Error activating reservation" });
  }
});

router.delete("/endReservation", verifyUser, async (req, res) => {
  const { Email: userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).send({ message: "User email is required" });
  }
  try {
    const reservation = await Reservation.findOne({ userEmail });

    if (!reservation) {
      return res.status(404).send({ message: "Reservation not found" });
    }

    const stationId = reservation.stationId;
    const station = await Station.findOne({ stationId });

    if (!station) {
      return res.status(404).send({ message: "Station not found" });
    }
    if (station.currentUserInfo === userEmail) {
      const updatedStation = await Station.findOneAndUpdate(
        { stationId },
        {
          $unset: { currentUserInfo: "" },
          $set: { chargerAvailability: "Available" },
        },
        { new: true }
      );

      if (!updatedStation) {
        return res.status(500).send({ message: "Failed to update station" });
      }
    }

    await Reservation.deleteOne({ userEmail });

    await EventLog.create({
      description: `Reservation ended: User ${userEmail} ended reservation at Station ${stationId}`,
      eventType: "reservation",
      userId: req.user.id,
      email: req.user.email,
    });

    res.status(200).json({
      message: "Reservation ended successfully",
    });
  } catch (err) {
    console.error("Error ending and deleting reservation:", err);
    res.status(500).send({ message: "Error ending and deleting reservation" });
  }
});

module.exports = router;
