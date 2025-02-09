import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import jwt from 'jsonwebtoken';
import {jwtDecode} from "jwt-decode";
import API from './RequestHeader';

function decodeToken(token) {
  try {
      const decoded = jwtDecode(token);
      return decoded;
  } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
  }
}


const handleApiError = (error) => {
  const errorMessage = error.response?.data || error.message;
  toast.error(errorMessage);
  return errorMessage;
};

export const RegisterUser = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, data);
    if(response.status === 200){
      return response;
      }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const LoginUser = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data);
    if (response.status === 200) {
      const { token, user } = response.data; 
      const decodedToken = decodeToken(token);
      localStorage.setItem('encodedToken', token); 
      localStorage.setItem('token', JSON.stringify(decodedToken));
      localStorage.setItem('user', JSON.stringify(user));
      return response;
    } else {
      toast.error('User not found!');
      return response;
    }
  } catch (error) {
    return handleApiError(error);
  }
};


export const GetUserData = async (email) => {
  try {
    const response = await API.get('/user/getUserData', { params: { email } });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const EditProfile = async (data) => {
  try {
    const response = await API.put('/user/updateProfile', data);
    const user = response.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const AddCar = async (data) => {
  try {
    const response = await API.post('/user/addCar', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const RemoveCar = async (data) => {
  try {
    const response = await API.delete('/user/removeCar', { data });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetCars = async (id) => {
  try {
    const response = await API.get('/user/getCars', { params: { Id: id } });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ChangeCarBattery = async (data) => {
  try {
    const response = await API.put('/user/changeBattery', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ChangeUserPassword = async (data) => {
  try {
    const response = await API.put('/user/changePassword', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetReservations = async (start, end) => {
  try {
    const response = await API.get('/reservation/getReservations/SelectedPeriod', { params: { Start: start, End: end } });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetReservation = async (email) => {
  try {
    const response = await API.get('/reservation/getReservations/SelectedUser', { params: { Email: email } });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const Reserve = async (data) => {
  try {
    const response = await API.post('/reservation/reserveStation', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const EndReservation = async (data) => {
  try {
    const response = await API.delete('/reservation/endReservation', { data });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ActivateReservation = async (data) => {
  try {
    const response = await API.put('/reservation/activateReservation', data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};