import { GetCars, AddCar } from "../../Services/UserService";
import {getUserFromLocalStorage} from "../../Model/User";
import { useState ,  useEffect} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import ListVehicles from './ListVehicles';

 
function AddVehicle() {
    const [errorMessages, setErrorMessages] = useState({});
    const [cars, setCars] = useState([]);
    const [userId, setUserId] = useState("");

    const fetchCars = async () => {
        const user = getUserFromLocalStorage();
        setUserId(user.id);
        try {
          const response = await GetCars(user.id);

          setCars(response.data.cars);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
      };

    useEffect(() => {
    
        fetchCars();
    }, []);

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const model = event.target.model.value;
        const chargerType = event.target.chargerType.value;
        const batteryCapacity = event.target.batteryCapacity.value;
        const yearOfProduction = event.target.yearOfProduction.value;
        const averageConsumption = event.target.averageConsumption.value;

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
            fetchCars();
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
        setErrorMessages({ name: "yearOfProduction", message: "" })
        setErrorMessages({ name: "averageConsumption", message: "" })
        if (validate(event)) {
            const jsonData = {
                Model: event.target.model.value,
                ChargerType: event.target.chargerType.value,
                BatteryCapacity: event.target.batteryCapacity.value,
                YearOfProduction: event.target.yearOfProduction.value.toString(),
                AverageConsumption: event.target.averageConsumption.value,
                UserId: userId
            };
            
            add(jsonData);            

        }
    }
    return (
        <>
        <ListVehicles cars = {cars} fetchCars = {fetchCars}/>
                <div className="container mt-5 ">
                    <h2>Add New Vehicle</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
        <Form onSubmit={handleSubmit}>
        <div className="card">
        <div className="card-body">
                    <Form.Group controlId="name">
                        <Form.Label><h2>Model</h2></Form.Label>
                        <Form.Control type="text" name="model" />
                        {renderErrorMessage("model")}
                    </Form.Group>

                    <Form.Group controlId="chargerType">
                        <Form.Label><h2>Charger Type</h2></Form.Label>
                        <Form.Control type="text" name="chargerType" />
                        {renderErrorMessage("chargerType")}
                    </Form.Group>

                    <Form.Group controlId="batteryCapacity">
                        <Form.Label><h2>Battery Capacity</h2></Form.Label>
                        <Form.Control type="number" name="batteryCapacity" />
                        {renderErrorMessage("batteryCapacity")}
                    </Form.Group>

                    <Form.Group controlId="yearOfProduction">
                        <Form.Label><h2>Year Of Production</h2></Form.Label>
                        <Form.Control type="date" name="yearOfProduction" />
                        {renderErrorMessage("yearOfProduction")}
                    </Form.Group>

                    <Form.Group controlId="averageConsumption">
                        <Form.Label><h2>Average Consumption</h2></Form.Label>
                        <Form.Control type="number" name="averageConsumption" />
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