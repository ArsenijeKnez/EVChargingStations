import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from './RequestHeader';

const handleApiError = (error) => {
  const errorMessage = error.response?.data || error.message;
  toast.error(errorMessage);
  return errorMessage;
};

export const GetStations = async () => {
  try {
    const response = await API.get('/stations/');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetStationsGuest = async () => {
  try {
    const response = await API.get('/stations/guest');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const CreateStation = async (data) => {
  try {
    const response = await API.post('/stations/post', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const DeleteStation = async (id) => {
  try {
    const response = await API.delete(`/stations/${id}`);
    toast.success('Station deleted successfully');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ChangeAvailability = async (data) => {
  try {
    const response = await API.put('/stations/put/availability', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};
