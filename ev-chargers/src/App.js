import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./Styles/ALL.css";
import Login from "./Components/Login";
import Map from "./Components/Map";
import { ToastContainer, toast } from 'react-toastify';
import PrivateRoute from './Components/PrivateRoute';
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import HomePage from "./Pages/HomePage";
import Unauthorized from "./Components/Unathorized";
import GuestPage from "./Pages/GuestPage";
import ChangePassword from "./Components/ChangePassword";
import AddVehicle from "./Components/User/AddVehicle";
import UserMap from "./Components/User/UserMap";



function App() {
  return (
    <div>
    <div className="App">
      <ToastContainer position='top-right' autoClose={3000}/>

      <header className="App-header">
        <Routes>
        <Route path='/' element={<PrivateRoute allowedRoles={['Guest']}><GuestPage/></PrivateRoute>}>
        <Route path='/' element={<PrivateRoute allowedRoles={['Guest']}><Map/></PrivateRoute>}/>
        <Route path='/login' element={<PrivateRoute allowedRoles={['Guest']}><Login/></PrivateRoute>}/>
        <Route path='/register' element={<PrivateRoute allowedRoles={['Guest']}><Register/></PrivateRoute>}/>
        </Route>
        <Route path='/unauthorized' element= {<Unauthorized/>}/>
        <Route path='/home/' element={<PrivateRoute allowedRoles={['Admin','User']}><HomePage/></PrivateRoute>}>
          <Route path='/home/profile' element={<PrivateRoute allowedRoles={['Admin','User']}><Profile/></PrivateRoute>}/>
          <Route path='/home/map' element={<PrivateRoute allowedRoles={'User'}><UserMap/></PrivateRoute>}/>
          <Route path='/home/changePassword' element={<PrivateRoute allowedRoles={['Admin','User']}><ChangePassword/></PrivateRoute>}/>
          <Route path='/home/addVehicle' element={<PrivateRoute allowedRoles={['User']}><AddVehicle/></PrivateRoute>}/>
        </Route>
        </Routes>
      </header>
      </div>
    </div>
  );
}

export default App;