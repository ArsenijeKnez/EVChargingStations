import React from "react";
import { Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserFromLocalStorage, User} from '../Model/User';

export default function PrivateRoute({ children, allowedRoles }) {
    const location = useLocation();
    const decodedToken = JSON.parse(localStorage.getItem('token'));

    if (!decodedToken || !decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
        if(allowedRoles.includes("Guest"))
            return children;
        return <Navigate to='/login' />
    }
    else {
        const role = decodedToken.user_role;
        var u = getUserFromLocalStorage();

        if(allowedRoles[0] === "Guest")
            return <Navigate to='/home/profile' />

        if(role === "User" && u.blocked === true)
            return <Navigate to='/unauthorized' />

        if (!allowedRoles.includes(role)) {
            return <Navigate to='/unauthorized' />
        }

        return children

    }
};