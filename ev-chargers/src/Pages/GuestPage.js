import GuestHeader from "../Components/GuestHeader";
import { Outlet } from "react-router-dom";

function GuestPage(){
    return (
    <>
        <GuestHeader/>
        <Outlet/>
    </>

    )
}
export default GuestPage;