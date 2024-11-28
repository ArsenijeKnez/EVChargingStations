import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import jwt from 'jsonwebtoken';
import {jwtDecode} from "jwt-decode";
import {User} from "../Model/User";

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
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, data);
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
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, data);

    if (response.status === 200) {
      const { token, user } = response.data; 
      const decodedToken = decodeToken(token);

      localStorage.setItem('token', token); 
      localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
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



export const GetUserData = async (username) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUserData`, {
      params: { username },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const EditProfile = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/updateProfile`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetUsers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUsers`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('encodedToken')),
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const VerifyUser= async (username, v) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/verify/${username}/${v}`, [], {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  JSON.parse(localStorage.getItem('encodedToken')),
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ChangeUserPassword = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/changePassword`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};
