import { useState } from "react";
import { LoginUser } from "../Services/UserService";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";

function Login() {
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate();
    //toast.configure();
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );
    function validate(event)
    {
        var valid = true;
        if(event.target.email.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "email", message: "Email is required!" });
        }
        if(event.target.password.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "password", message: "Password is required!" });
        }
        return valid;
    }
    const login = async(data) =>
    {
        const r = await LoginUser(data);
        if(!r){
          toast.error("Unknown error");
        }
        else if(r.status === 200)
          navigate('/home/profile');
        else{
          const errorMessage = r.response?.data || r.message;
          toast.error(errorMessage);
        }
    }
    const handleSubmit = (event) =>
    {
        event.preventDefault();
        setErrorMessages({ name: "email", message: "" })
        setErrorMessages({ name: "password", message: "" })
        if(validate(event))
        {
            const sendData = {
              Email : event.target.email.value,
              Password : event.target.password.value
            };
            login(sendData);

        }
    }
    return (
        <div className="container mt-5 ">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">Login</h1>
                  <Form.Group controlId="email" className="container mt-3">
                    <Form.Label><h2>Email</h2></Form.Label>
                    <Form.Control type="text" name="emai"/>
                    {renderErrorMessage("email")}
                  </Form.Group>
                  <Form.Group controlId="password" className="container mt-2">
                    <Form.Label><h2>Password</h2></Form.Label>
                    <Form.Control type="password" name="password"/>
                    {renderErrorMessage("password")}
                  </Form.Group>
                  <Form.Group className="container mt-2">
                    <Button variant="outline-success" type="submit" className="w-100">
                      Login
                    </Button>
                  </Form.Group>
                  <div className="container mt-3">
                    <p>Don't have an account? Go to{" "}
                    <a href="/register" className="link-dark">
                      Registration
                    </a></p>
                  </div>
                </div>

              </div>
            </Form>
          </div>
        </div>
      </div>
        // <div>
        // <form onSubmit={handleSubmit}>
        //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        //         <div style={{ flexDirection: 'column', border: '3px solid #b0b0b0', borderRadius: '5px', padding: '10px', width: '400px', margin: '200px', backgroundColor: '#ededed' }}>
        //             <div style={{ margin: '5px' }}>username <input type='text' name="username"/>{renderErrorMessage("username")}</div>
        //             <div style={{ margin: '5px' }}>password <input type='password' name="password"/>{renderErrorMessage("password")}</div>
        //             <div style={{ margin: '5px' }}><input type='submit' value="Login"/></div>
        //             <div style={{ margin: '5px' }}>Don't have an account? Go to <a href='/register'>Registration</a></div>
        //         </div>
        //     </div>
        // </form>
        // </div>
    )
}

export default Login;