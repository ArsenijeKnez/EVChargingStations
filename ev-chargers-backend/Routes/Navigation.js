const express = require("express");
const Reservation = require("../Schemas/Reservation");
const Station = require("../Schemas/Station");
const Car = require("../Schemas/Car");
const axios = require("axios");
const router = express.Router();
const verifyUser = require("./JWTverification/VerifyUser");
const EventLog = require("../Schemas/EventLog");

router.get("/route", verifyUser, async (req, res) => {
  const { Start: start, End: end } = req.query;

  if (!start || !end) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const response = await axios.post(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      { coordinates: [start, end], radiuses: [500, 500] },
      { headers: { Authorization: process.env.ApiKey } }
    );

    if (response.data.routes && response.data.routes[0].geometry) {
      const encodedGeometry = response.data.routes[0].geometry;
      res.status(200).json({ route: encodedGeometry });
    } else {
      return res.status(404).send({ message: "Route not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error getting route" });
  }
});

router.get("/bestRoute", verifyUser, async (req, res) => {
  const { start, userEmail, carId } = req.query;

  if (!start) {
    return res.status(400).send({ message: "User position not defined" });
  }

  const previousReservation = await Reservation.findOne({ userEmail });
  if (previousReservation) {
    return res
      .status(400)
      .send({ message: "User cannot have two reservations" });
  }

  const car = await Car.findOne({ carId });
  if (!car) {
    return res.status(404).send({ message: "Car not found" });
  }

  const [startLng, startLat] = start;

  const startLngNum = parseFloat(startLng);
  const startLatNum = parseFloat(startLat);
  const stations = await Station.find({
    chargerType: car.chargerType,
    chargerAvailability: "Available",
  });

  if (!stations.length) {
    return res
      .status(404)
      .json({ message: "No station found with apropriate charger" });
  }

  let nearestStation = null;
  let minDistance = Infinity;

  for (const station of stations) {
    const lng = station.coordinates.lng;
    const lat = station.coordinates.lat;
    const distance = Math.abs(lng - startLngNum) + Math.abs(lat - startLatNum);

    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  }
  if (!nearestStation) {
    return res
      .status(404)
      .send({ message: "No suitable charging station found" });
  }

  const end = [nearestStation.coordinates.lng, nearestStation.coordinates.lat];

  try {
    const response = await axios.post(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      { coordinates: [start, end], radiuses: [500, 500] },
      { headers: { Authorization: process.env.ApiKey } }
    );

    if (response.data.routes && response.data.routes[0].geometry) {
      const startTime = Date.now();
      const endTime = Date.now() + 600000;
      const newReservation = new Reservation({
        userEmail: userEmail,
        carId: carId,
        stationId: nearestStation.stationId,
        start: startTime,
        end: endTime,
      });
      await newReservation.save();
      const encodedGeometry = response.data.routes[0].geometry;
      await EventLog.create({
        description: `Reservation created: User ${userEmail} reserved Station ${nearestStation.stationId} from ${startTime} to ${endTime}`,
        eventType: "reservation",
        userId: req.user.id,
        email: req.user.email,
      });
      res
        .status(200)
        .json({ route: encodedGeometry, stationId: nearestStation.stationId });
    } else {
      return res.status(404).send({ message: "Route not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error getting route" });
  }
});

module.exports = router;
