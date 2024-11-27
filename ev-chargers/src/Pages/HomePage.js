import { ToastContainer } from "react-toastify";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

function HomePage(){
    return (
    <>
        <Header/>
        <Outlet/>
    </>

    )
}
export default HomePage;