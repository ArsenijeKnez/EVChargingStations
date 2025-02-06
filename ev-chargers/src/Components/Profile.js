import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetUserData,EditProfile } from "../Services/UserService";
import { Form, Button } from 'react-bootstrap';
import {User, getUserFromLocalStorage} from "../Model/User";
//import { get } from "react-hook-form";

function Profile()
{
    const [errorMessages, setErrorMessages] = useState({});
    const [name,setName] = useState('');
    const [lastname,setLastname] = useState('');
    const [email,setEmail] = useState('');
    const [id,setId] = useState('');
    const nav = useNavigate();

    useEffect(()=>{

        const userData = getUserFromLocalStorage();
        setName(userData.name);
        setLastname(userData.lastname);
        setEmail(userData.email);
        setId(userData.id);

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
      if(resp.status === 200 || resp.status === 201)
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
            const jsonData = {
              Id: id,
              Name: event.target.name.value,
              Lastname: event.target.lastname.value,
              Email: event.target.email.value,
          };
          
          sendData(jsonData); 
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
    return(
      <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
      <Form onSubmit={handleSubmit} className="border rounded">
      <div className="card">
      <div className="card-body">
            <div className="m-2">
              <Form.Label><h2>Name</h2></Form.Label>
              <Form.Control type="text" name="name" defaultValue={name} onChange={handleNameChange} />
              {renderErrorMessage("name")}
            </div>
            <div className="m-2">
              <Form.Label><h2>Lastname</h2></Form.Label>
              <Form.Control type="text" name="lastname" defaultValue={lastname} onChange={handleLastNameChange} />
              {renderErrorMessage("lastname")}
            </div>
            <div className="m-2">
              <Form.Label><h2>Email</h2></Form.Label>
              <Form.Control type="email" name="email" defaultValue={email} onChange={handleEmailChange} />
              {renderErrorMessage("email")}
            </div>
            <div className="m-2">
              <Button variant="outline-success" type="submit" className="w-100">Save</Button>
            </div>
            </div>
            </div>
        </Form>
        </div>
        </div>
        </div>
    );
}
export default Profile;