import {GetUsers, UnBlockUser} from "../../Services/AdminService";
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

function BlockUser(){
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
      try {
        const Response = await GetUsers();
        if(Response.status !== 200){
          toast.error("No users are avalabile at this time");
          return;
        }
        if (Response.data.length === 0) {
          toast.info("No users are avalabile at this time");
          return;
        }
        setUsers(Response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

  
    useEffect(() => {
      fetchUsers();
    }, []);

    const onUnBlockUser = async(data)=>{
       try {
            const response = await UnBlockUser({UserId: data});
            if(response.status === 200){
              toast.info(response.data.message);
              fetchUsers();
            }
            else{
              toast.error(response.error);
            }
          } catch (error) {
            console.error('Error un/blocking user:', error);
          }
    };

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
      <div className="table-viewer">
        <h3>Block Users</h3>
        <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user, index) => (
      <tr key={index}>
        <td>{user.name}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>
          <button onClick={() => onUnBlockUser(user.userId)}>
            {user.blocked ? "Unblock" : "Block"}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
        </div>
        </div>
    )
}
export default BlockUser;