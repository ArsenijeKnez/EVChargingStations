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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stationsGuest/`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };