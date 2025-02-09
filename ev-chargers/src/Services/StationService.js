import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import jwt from 'jsonwebtoken';
//import {jwtDecode} from "jwt-decode";
//import {User} from "../Model/User";

const handleApiError = (error) => {
    const errorMessage = error.response?.data || error.message;
    toast.error(errorMessage);
    return errorMessage;
  };

export const GetStations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stations/`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

export const GetStationsGuest = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stations/guest`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

  
export const CreateStation = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/stations/post`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const DeleteStation = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/stations/${id}`);
        toast.success('Station deleted successfully');
        return response;
    } catch (error) {
        return handleApiError(error);
    }
};

export const ChangeAvailability = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/stations/put/availability`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};