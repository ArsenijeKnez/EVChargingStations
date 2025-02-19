import { RegisterUser } from "../Services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";

function Register() {
  const [errorMessages, setErrorMessages] = useState({});
  const nav = useNavigate();

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div style={{ color: "red", fontSize: "15px" }}>
        {errorMessages.message}
      </div>
    );

  function validate(event) {
    var valid = true;
    const password = event.target.password.value;
    const password2 = event.target.password2.value;
    const email = event.target.email.value;
    const name = event.target.name.value;
    const lastname = event.target.lastname.value;
    const usertype = event.target.usertype.value;

    if (password.trim() === "") {
      setErrorMessages({ name: "password", message: "Password is required!" });
      valid = false;
    }
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
    if (usertype.trim() === "") {
      setErrorMessages({ name: "usertype", message: "User Type is required!" });
      valid = false;
    }
    if (password2 !== password) {
      setErrorMessages({ name: "password", message: "Passwords do not match" });
      valid = false;
    }
    return valid;
  }
  const reg = async (data) => {
    const r = await RegisterUser(data);
    if (r.status === 200 || r.status === 201) {
      toast.success("successful registration!");
      nav("/login");
    } else {
      toast.error("failed registration!");
      console.log("error");
    }
  };
  function handleSubmit(event) {
    event.preventDefault();

    setErrorMessages({ name: "password", message: "" });
    setErrorMessages({ name: "email", message: "" });
    setErrorMessages({ name: "name", message: "" });
    setErrorMessages({ name: "lastname", message: "" });
    setErrorMessages({ name: "usertype", message: "" });
    if (validate(event)) {
      const jsonData = {
        Name: event.target.name.value,
        Lastname: event.target.lastname.value,
        Password: event.target.password.value,
        Email: event.target.email.value,
        UserType: event.target.usertype.value,
      };

      reg(jsonData);
    }
  }
  return (
    <>
      <div className="container mt-5 ">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-body">
                  <h1>Register</h1>
                  <Form.Group controlId="name" className="container mt-3 ">
                    <Form.Label>
                      <h2>Name</h2>
                    </Form.Label>
                    <Form.Control type="text" name="name" />
                    {renderErrorMessage("name")}
                  </Form.Group>

                  <Form.Group controlId="lastname" className="container mt-2 ">
                    <Form.Label>
                      <h2>Lastname</h2>
                    </Form.Label>
                    <Form.Control type="text" name="lastname" />
                    {renderErrorMessage("lastname")}
                  </Form.Group>

                  <Form.Group controlId="email" className="container mt-2 ">
                    <Form.Label>
                      <h2>Email</h2>
                    </Form.Label>
                    <Form.Control type="email" name="email" />
                    {renderErrorMessage("email")}
                  </Form.Group>

                  <Form.Group controlId="password" className="container mt-2 ">
                    <Form.Label>
                      <h2>Password</h2>
                    </Form.Label>
                    <Form.Control type="password" name="password" />
                    {renderErrorMessage("password")}
                  </Form.Group>

                  <Form.Group controlId="password2" className="container mt-2 ">
                    <Form.Label>
                      <h2>Password check</h2>
                    </Form.Label>
                    <Form.Control type="password" name="password2" />
                    {renderErrorMessage("password check")}
                  </Form.Group>

                  <Form.Group controlId="usertype" className="container mt-2 ">
                    <Form.Label>
                      <h2>User Type</h2>
                    </Form.Label>
                    <Form.Control as="select" name="usertype">
                      <option value="User">
                        <p>User</p>
                      </option>
                      <option value="Admin">
                        <p>Admin</p>
                      </option>
                    </Form.Control>
                    {renderErrorMessage("usertype")}
                  </Form.Group>

                  <Button
                    variant="outline-success"
                    type="submit"
                    className="w-100"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
