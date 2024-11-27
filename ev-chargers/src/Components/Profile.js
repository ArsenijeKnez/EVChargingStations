import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetUserData,EditProfile } from "../Services/UserService";
import { Form, Button } from 'react-bootstrap';
import {User, getUserFromLocalStorage} from "../Model/User";
import { get } from "react-hook-form";

function Profile()
{
    const [errorMessages, setErrorMessages] = useState({});
    const [name,setName] = useState('');
    const [lastname,setLastname] = useState('');
    const [email,setEmail] = useState('');
    const [date,setDate]  = useState('');
    const [userType,setUserType] = useState('');
    const[formData,setFormData]=useState('');
    const nav = useNavigate();

    useEffect(()=>{
        const u = localStorage.getItem('user');
        const t = localStorage.getItem('googleuser');
        console.log(t);
        setIsGoogleUser(t);

        const userData = getUserFromLocalStorage();
        setUserType(userData.Role());
        setName(userData.name);
        setLastname(userData.lastname);
        setEmail(userData.email);

    },[])
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const email = event.target.email.value;
        const name = event.target.name.value;
        const lastname = event.target.lastname.value;

        if (email.trim() === "") {
            setErrorMessages({ name: "email", message: "Email is required!" });
            valid = false;
        }
        if (name.trim() === "") {
            setErrorMessages({ name: "name", message: "Name is required!" });
            valid = false;
        }
        if (lastname.trim() === "") {
            setErrorMessages({ name: "lastname", message: "Lastname is required!" });
            valid = false;
        }
        return valid;


    }

    const sendData = async(data) =>{
      const resp = await EditProfile(data);
      if(resp.status === 200)
      {
        toast.success('succesful edit of profile!');
      }
      else {
        console.log('error');
        toast.error('Failed to update data');
      }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrorMessages({ name: "email", message: "" })
        setErrorMessages({ name: "name", message: "" })
        setErrorMessages({ name: "lastname", message: "" })
        if (validate(event)) {
            const formData = new FormData();
            formData.append('name', event.target.name.value);
            formData.append('lastname', event.target.lastname.value);
            //formData.append('password', event.target.password.value);
            formData.append('email', event.target.email.value);
            formData.append('usertype', userType);
            formData.append('timeOfCreation', userType);
            sendData(formData);
        }
    }
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleLastNameChange = (event) => {
        setLastname(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    /*const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };*/
    return(
        <Form onSubmit={handleSubmit} id="form">
        <div className="d-flex justify-content-center align-items-center mt-2">
          <div className="d-flex flex-column border border-gray rounded p-3 w-400px m-200px bg-light">
            <div className="m-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={name} onChange={handleNameChange} />
              {renderErrorMessage("name")}
            </div>
            <div className="m-2">
              <Form.Label>Lastname</Form.Label>
              <Form.Control type="text" name="lastname" defaultValue={lastname} onChange={handleLastNameChange} />
              {renderErrorMessage("lastname")}
            </div>
            <div className="m-2">
              <Form.Label>Email</Form.Label>
              {
              isGoogleUser==='false' &&
              <Form.Control type="email" name="email" defaultValue={email} onChange={handleEmailChange} />
              }
              {
              isGoogleUser==='true' &&
              <Form.Control type="email" name="email" defaultValue={email} onChange={handleEmailChange} disabled/>
              }
              {renderErrorMessage("email")}
            </div>
            <div className="m-2">
              <Button variant="success" type="submit" >Save</Button>
            </div>
          </div>
        </div>
      </Form>
    );
}
export default Profile;