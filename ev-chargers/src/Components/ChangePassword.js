import { useState } from "react";
import { ChangeUserPassword } from "../Services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {User, getUserFromLocalStorage} from "../Model/User";

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
            var formData = new FormData();
            const u = getUserFromLocalStorage();
            //console.log(u);
            const token = localStorage.getItem('encodedtoken');
           // const data = {Username:u,OldPassword:event.target.oldPassword.value,NewPassword:event.target.newPassword.value};
            formData.append("Username",u.Username());
            formData.append("NewPassword",event.target.newPassword.value);
            formData.append("OldPassword",event.target.oldPassword.value);
            const resp = await ChangeUserPassword(formData);
            if(resp.status === 200){
                toast.success('succesful pasword change!');
                nav('/home');
            }
            else 
                toast.error('wrong old password!');
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
        <div className="mt-2">
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column border p-3 w-400px m-200px bg-light border border-gray rounded">
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
        </form>
      </div>
    );
}
export default ChangePassword;