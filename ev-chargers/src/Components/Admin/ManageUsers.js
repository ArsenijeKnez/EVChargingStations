import {
  GetUsers,
  UnBlockUser,
  EditUserData,
  DeleteUser,
} from "../../Services/AdminService";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import EditUser from "./EditUser";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const Response = await GetUsers();
      if (Response.status !== 200) {
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

  const onUnBlockUser = async (data) => {
    try {
      const response = await UnBlockUser({ UserId: data });
      if (response.status === 200) {
        toast.info(response.data.message);
        fetchUsers();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error un/blocking user:", error);
    }
  };

  const onEditUser = async (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleEditUser = async (user) => {
    const response = await EditUserData(user);
    if (response.status === 200) {
      toast.success(response.data?.message || "User edited");
    } else {
      toast.error(response.error || "Faied to edit user");
    }
  };

  const onDeleteUser = async (userId) => {
    const response = await DeleteUser(userId);
    if (response.status === 200) {
      toast.success(response.data?.message || "User deleted");
      fetchUsers();
    } else {
      toast.error(response.error || "Faied to delete user");
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
                  <td
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button onClick={() => onEditUser(user)}>Edit</button>
                    <button
                      style={{
                        backgroundColor: user.blocked ? "#4CAF50" : "#FF5722",
                      }}
                      onClick={() => onUnBlockUser(user.userId)}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>

                    <button
                      style={{ backgroundColor: "#f44336" }}
                      onClick={() => onDeleteUser(user.userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditUser
        user={editUser}
        handleEditUser={handleEditUser}
        toggleModal={() => setIsModalOpen(!isModalOpen)}
        isModalOpen={isModalOpen}
      />
    </div>
  );
}
export default ManageUsers;
