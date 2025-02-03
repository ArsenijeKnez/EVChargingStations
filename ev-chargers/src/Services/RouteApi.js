import axios from "axios";
import polyline from "@mapbox/polyline";

export const getRoute = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf62487dc66681eafa494bafb729b708b1470b";
  
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        { coordinates: [start, end],
          radiuses: [500, 500],
         },
        { headers: { Authorization: apiKey } }
      );
  
      if (response.data.routes && response.data.routes[0].geometry) {
        const encodedGeometry = response.data.routes[0].geometry;
        return polyline.decode(encodedGeometry); 
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      return [];
    }
  };