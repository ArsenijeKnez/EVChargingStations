import React from 'react';

const ListVehicles = ({ cars }) => {
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
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.carId}>
                <td>{car.carId}</td>
                <td>{car.model}</td>
                <td>{car.chargerType}</td>
                <td>{car.batteryCapacity}</td>
                <td>{car.batteryPercentage}%</td>
                <td>{new Date(car.yearOfProduction).toLocaleDateString()}</td>
                <td>{car.averageConsumption} kWh/100km</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListVehicles;
