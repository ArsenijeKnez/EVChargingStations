import React from 'react';

export class User {
    constructor(name, lastname, blocked, timeOfCreation, userType, email, id) {
        this.name = name;
        this.lastname = lastname;
        this.blocked = blocked;
        this.timeOfCreation = timeOfCreation;
        this.userType = userType;
        this.email = email;
        this.id = id;
    }
    

    isBlocked() {
      return this.blocked === true;
  }

    Username(){
      return this.username;
    }

    Role() {
      return this.userType;
  }

    static fromObject(obj) {
        return new User(
            obj.name,
            obj.lastname,
            obj.address,
            obj.timeOfCreation,
            obj.userType,
            obj.email,
            obj.id,
        );
    }
}

export function getUserFromLocalStorage() {
  const userJson = localStorage.getItem('user');

  if (userJson) {
      const userObj = JSON.parse(userJson);

      return User.fromObject(userObj);
  }

  return null; 
}

