
export class ChargingTrack {
    constructor(stationId, track, isCharging, positionIndex, carId) {
        this.stationId = stationId;
        this.track = track;
        this.isCharging = isCharging;
        this.positionIndex = positionIndex;
        this.carId = carId;
    }

    static fromObject(obj) {
        return new ChargingTrack(
            obj.stationId,
            obj.track,
            obj.isCharging,
            obj.positionIndex,
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
