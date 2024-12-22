import React from 'react';
import { RemoveCar} from "../../Services/UserService";
import { toast } from 'react-toastify';

const ListVehicles = ({ cars, fetchCars }) => {

  const onRemoveVehicle = async(id)=>{
    try {
        const response = await RemoveCar({CarId: id});
        if(response.status === 200){
          toast.success(response.data.message);
          fetchCars();
        }
        else{
          toast.error(response.error);
        }
    } 
    catch (error) {
        console.error('Error removin car:', error);
    }
  };

  return (
    <div className="table-viewer">
      <h2>User Vehicles</h2>
      {cars.length === 0 ? (
        <p>User still has no cars.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Car ID</th>
              <th>Model</th>
              <th>Charger Type</th>
              <th>Battery Capacity</th>
              <th>Battery Percentage</th>
              <th>Year of Production</th>
              <th>Average Consumption</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.carId}>
                <td>{car.carId}</td>
                <td>{car.model}</td>
                <td>{car.chargerType}</td>
                <td>{car.batteryCapacity}</td>
                <td>{car.batteryPercentage.toFixed(2)}%</td>

                <td>{new Date(car.yearOfProduction).toLocaleDateString()}</td>
                <td>{car.averageConsumption} kWh/100km</td>
                <td>
                  <button onClick={() => onRemoveVehicle(car.carId)}>
                    Remove Vehicle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListVehicles;
