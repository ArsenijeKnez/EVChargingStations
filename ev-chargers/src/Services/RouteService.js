import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from './RequestHeader';

const handleApiError = (error) => {
  const errorMessage = error.response?.data || error.message;
  toast.error(errorMessage);
  return errorMessage;
};

export const getRoute = async (start, end) => {
  try {
    const response = await API.get('/navigation/route', { params: { Start: start, End: end } });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
  };

  export const getBestRoute = async (start, userEmail, carId) => {
    try {
      const response = await API.get('/navigation/bestRoute', { params: {start, userEmail, carId} });
      return response;
    } catch (error) {
      return handleApiError(error);
    }
      
    };