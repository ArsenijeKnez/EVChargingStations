import React from 'react';

export class User {
    constructor(name, lastName, blocked, timeOfCreation, type, email, id) {
        this.name = name;
        this.lastname = lastName;
        this.blocked = blocked;
        this.timeOfCreation = timeOfCreation;
        this.userType = type;
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
            obj.lastName,
            obj.address,
            obj.timeOfCreation,
            obj.type,
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

