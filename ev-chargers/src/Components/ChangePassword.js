import { useState } from "react";
import { ChangeUserPassword } from "../Services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {User, getUserFromLocalStorage} from "../Model/User";
import { Form } from 'react-bootstrap';

function ChangePassword()
{
    const nav = useNavigate();
    const [errorMessages, setErrorMessages] = useState({});
    const handleSubmit = async(event) =>
    {
        event.preventDefault();
        setErrorMessages({ name: "oldPassword", message: "" })
        setErrorMessages({ name: "newPassword", message: "" })
        if(validate(event))
        {
            const u = getUserFromLocalStorage();
            const newPassJson = {
              Email : u.email,
              OldPassword : event.target.oldPassword.value,
              NewPassword : event.target.newPassword.value
            };

            const resp = await ChangeUserPassword(newPassJson);
            if(resp.status === 200){
                toast.success('succesful pasword change!');
                nav('/home');
            }
            else 
                toast.error(resp.data.message);
        }
    }
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );
    function validate(event)
    {
        var valid = true;
        if(event.target.oldPassword.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "oldPassword", message: "Old password is required!" });
        }
        if(event.target.newPassword.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "newPassword", message: "New password is required!" });
        }
        return valid;
    }
    return(
      <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
            <div className="card">
              <div className="card-body">
              <div className="m-2">
                <label htmlFor="oldPassword" className="form-label">Old password</label>
                <input type="password" name="oldPassword" className="form-control" />
                {renderErrorMessage("oldPassword")}
              </div>
              <div className="m-2">
                <label htmlFor="newPassword" className="form-label">New password</label>
                <input type="password" name="newPassword" className="form-control" />
                {renderErrorMessage("newPassword")}
              </div>
              <div className="m-2">
                <input type="submit" value="Change password" className="btn btn-success"/>
              </div>
              </div>

</div>
</Form>
</div>
</div>
</div>
    );
}
export default ChangePassword;