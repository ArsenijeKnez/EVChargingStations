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

export const GetLogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/logs`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

export const GetLogsFilterd = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/logs/filter`, data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

  export const GetUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getUsers`);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

  
export const UnBlockUser = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/unBlockUser`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};