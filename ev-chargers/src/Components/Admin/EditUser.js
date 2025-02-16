import React, { useState, useEffect } from "react";

const EditUser = ({ user, handleEditUser, toggleModal, isModalOpen }) => {
    const [editedUser, setEditedUser] = useState({ ...user });
    const handleChange = (e) => {
      setEditedUser((prev) => ({
          ...prev, 
          [e.target.name]: e.target.value
      }));
  };

  useEffect(() => {
    if (isModalOpen) {
        setEditedUser({ ...user }); 
    }
}, [isModalOpen, user]);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditUser({ ...user, ...editedUser });
    toggleModal();
  };
  return (
    <div>
      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label htmlFor="name">Change Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="lastName">Change Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="email">Change Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="type">User Type:</label>
                <select
                  name="type"
                  value={editedUser.type}
                  onChange={handleChange}
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit">Apply</button>
                <button type="button" onClick={toggleModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "20px",
      width: "400px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
    },
    submitButton: {
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
    },
    cancelButton: {
      backgroundColor: "#f44336",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "4px",
    },
    error: {
      color: "red",
      marginBottom: "10px",
    },
  };
  

export default EditUser;
