import {GetUsers, UnBlockUser, EditUserData} from "../../Services/AdminService";
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import EditUser from './EditUser';

function ManageUsers(){
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const onEditUser = async(user)=>{
      setEditUser(user); 
      setIsModalOpen(true);
  };

  const handleEditUser = async (user) =>{
    const response = await EditUserData(user);
    if(response.status === 200){
      toast.success(response.data?.message || "User edited");
    }
    else{
      toast.error(response.data?.message || "Faied to edit user");
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
          <button onClick={() => onEditUser(user)}>
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
        </div>
        <EditUser user={editUser}  handleEditUser={handleEditUser}   toggleModal={() => setIsModalOpen(!isModalOpen)}
          isModalOpen = {isModalOpen}/>
        </div>
    )
}
export default ManageUsers;