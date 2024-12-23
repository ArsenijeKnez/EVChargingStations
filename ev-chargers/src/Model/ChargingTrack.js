
export class ChargingTrack {
    constructor(reservedStation, travelRoute, isParked, currentPositionIndex, carId) {
        this.reservedStation = reservedStation;
        this.travelRoute = travelRoute;
        this.isParked = isParked;
        this.currentPositionIndex = currentPositionIndex;
        this.carId = carId;
    }

    static fromObject(obj) {
        return new ChargingTrack(
            obj.reservedStation,
            obj.travelRoute,
            obj.isParked,
            obj.currentPositionIndex,
            obj.carId,
        );
    }
}

export function getChargingTrackFromLocalStorage() {
  const CTJson = localStorage.getItem('chargingTrack');

  if (CTJson) {
      const CTObj = JSON.parse(CTJson);

      return ChargingTrack.fromObject(CTObj);
  }

  return null; 
}

export function updateChargingTrackInLocalStorage(key, value) {
    const CTJson = localStorage.getItem('chargingTrack');

    if (CTJson) {
        const CTObj = JSON.parse(CTJson);

        if (key in CTObj) {
            CTObj[key] = value;

            localStorage.setItem('chargingTrack', JSON.stringify(CTObj));
        } else {
            console.error(`Key "${key}" does not exist in ChargingTrack object.`);
        }
    } 
}
