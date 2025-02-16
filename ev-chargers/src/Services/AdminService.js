import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from './RequestHeader';

const handleApiError = (error) => {
    const errorMessage = error.response?.data || error.message;
    toast.error(errorMessage);
    return errorMessage;
  };

  export const GetLogs = async () => {
    try {
      return await API.get('/admin/logs');
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  export const GetLogsFilterd = async (data) => {
    try {
      return await API.post('/admin/logs/filter', data);
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  export const GetUsers = async () => {
    try {
      return await API.get('/admin/getUsers');
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  export const UnBlockUser = async (data) => {
    try {
      return await API.post('/admin/unBlockUser', data);
    } catch (error) {
      return handleApiError(error);
    }
  };

  export const EditUserData = async (data) => {
    try {
      return await API.put('/admin/editUser', data);
    } catch (error) {
      return handleApiError(error);
    }
  };
