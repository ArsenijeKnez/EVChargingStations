import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import jwt from 'jsonwebtoken';
import {jwtDecode} from "jwt-decode";

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

// const verifyToken = (token) => {
//   const secretKey = process.env.REACT_APP_SECRET_KEY;
//   const issuer = process.env.REACT_APP_ISSUER;

//   try {
//     const decodedToken = jwt.verify(token, secretKey, { issuer });
//     const currentTime = Math.floor(Date.now() / 1000);

//     if (decodedToken.exp && decodedToken.exp < currentTime) {
//       throw new Error('Error: Expired token');
//     }

//     return decodedToken;
//   } catch (err) {
//     toast.error('Error: Expired or invalid token');
//     throw err;
//   }
// };

export const RegisterUser = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, data);
    if(response.status === 200){
     /*  const decodedToken = decodeToken(response.data.token);

      const user = User.fromObject(response.data.user);

      localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
      localStorage.setItem('token', JSON.stringify(decodedToken));
      localStorage.setItem('user', JSON.stringify(user));; */
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
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getUserData`, {
      params: { email },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const EditProfile = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/updateProfile`, data);
    const user = response.data.user; 
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const AddCar = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/addCar`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const RemoveCar = async (data) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/user/removeCar`, {data,});
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetCars = async (data) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/getCars`, {params: {
      Id: data, 
    },});
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const ChangeCarBattery = async(data) =>{
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/changeBattery`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export const ChangeUserPassword = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/changePassword`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetReservations = async (start, end) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservation/getReservations/SelectedPeriod`, {params: {
      Start: start, End: end, 
    },});
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetReservation = async (data) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservation/getReservations/SelectedUser`, {params: {
      Email: data, 
    },});
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const Reserve = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/reservation/reserveStation`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const EndReservation = async (data) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/reservation/endReservation`, {data,});
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ActivateReservation = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/reservation/activateReservation`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};