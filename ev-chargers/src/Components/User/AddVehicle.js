import { AddCar } from "../../Services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';

 
function AddVehicle() {
    const [errorMessages, setErrorMessages] = useState({});
    const nav = useNavigate();

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const model = event.target.password.value;
        const chargerType = event.target.password2.value;
        const batteryCapacity = event.target.email.value;
        const batteryPercentage = event.target.name.value;
        const yearOfProduction = event.target.lastname.value;
        const averageConsumption = event.target.usertype.value;

        if (model.trim() === "") {
            setErrorMessages({ name: "model", message: "Model is required!" });
            valid = false;
        }
        if (chargerType.trim() === "") {
            setErrorMessages({ name: "chargerType", message: "Charger type is required!" });
            valid = false;
        }
        if (batteryCapacity.trim() === "") {
            setErrorMessages({ name: "batteryCapacity", message: "Battery capacity is required!" });
            valid = false;
        }
        if (batteryPercentage.trim() === "") {
            setErrorMessages({ name: "batteryPercentage", message: "Battery percentage is required!" });
            valid = false;
        }
        if (yearOfProduction.trim() === "") {
            setErrorMessages({ name: "yearOfProduction", message: "Year of production is required!" });
            valid = false;
        }
        if(averageConsumption.trim() === ""){
            setErrorMessages({ name: "averageConsumption", message: "Average consumption is required!" });
            valid = false;
        }
        return valid;


    }
    const add = async (data) => {
        const r = await AddCar(data);
        if(r.status === 200 || r.status === 201){
            toast.success('successfuly added vehicle!');
            nav('/login');
        }
        else {
            toast.error('failed vehicle registration!');
            console.log("error");
        }

    }
    function handleSubmit(event) {
        event.preventDefault();

        setErrorMessages({ name: "model", message: "" })
        setErrorMessages({ name: "chargerType", message: "" })
        setErrorMessages({ name: "batteryCapacity", message: "" })
        setErrorMessages({ name: "batteryPercentage", message: "" })
        setErrorMessages({ name: "yearOfProduction", message: "" })
        setErrorMessages({ name: "averageConsumption", message: "" })
        if (validate(event)) {
            const jsonData = {
                model: event.target.password.value,
                chargerType: event.target.password2.value,
                batteryCapacity: event.target.email.value,
                batteryPercentage: event.target.name.value,
                yearOfProduction: event.target.lastname.value,
                averageConsumption: event.target.usertype.value
            };
            
            add(jsonData);            

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
                    <Form.Group controlId="name">
                        <Form.Label>Model</Form.Label>
                        <Form.Control type="text" name="model" />
                        {renderErrorMessage("model")}
                    </Form.Group>

                    <Form.Group controlId="chargerType">
                        <Form.Label>Charger Type</Form.Label>
                        <Form.Control type="text" name="chargerType" />
                        {renderErrorMessage("chargerType")}
                    </Form.Group>

                    <Form.Group controlId="batteryCapacity">
                        <Form.Label>Battery Capacity</Form.Label>
                        <Form.Control type="text" name="batteryCapacity" />
                        {renderErrorMessage("batteryCapacity")}
                    </Form.Group>

                    <Form.Group controlId="yearOfProduction">
                        <Form.Label>Year Of Production</Form.Label>
                        <Form.Control type="date" name="yearOfProduction" />
                        {renderErrorMessage("yearOfProduction")}
                    </Form.Group>

                    <Form.Group controlId="averageConsumption">
                        <Form.Label>Average Consumption</Form.Label>
                        <Form.Control type="text" name="averageConsumption" />
                        {renderErrorMessage("averageConsumption")}
                    </Form.Group>

                    <Button variant="outline-success" type="submit" className="w-100">
                        Add
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

export default AddVehicle;