import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Styles/ALL.css";
import Login from "./Components/Login";
import Map from "./Components/Map";
import { ToastContainer, toast } from 'react-toastify';
import PrivateRoute from './Components/PrivateRoute';
import Register from "./Components/Register";
import HomePage from "./Components/Register";
import Unauthorized from "./Components/Unathorized";
import Header from "./Components/Header";
import GuestPage from "./Pages/GuestPage";


function App() {
  //const navigate = useNavigate();

  return (
    <div><Header/>
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
        <Route path='/home' element={<PrivateRoute allowedRoles={['Admin','User']}><HomePage/></PrivateRoute>}/>
        </Routes>
      </header>
      </div>
    </div>
  );
}

export default App;