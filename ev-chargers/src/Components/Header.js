import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {User , getUserFromLocalStorage} from "../Model/User";

function Header() {
    const nav = useNavigate();
    const [userRole, setUserRole] = useState(null);

    const location = useLocation();
    
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('encodedtoken');
        localStorage.removeItem('chargingTrack');
        setUserRole('');
        nav('/login');
    }
    useEffect(() => {
        setUserRole('');
        const currentPath = location.pathname;
        if(currentPath === '/login' || currentPath === '/register' || currentPath === '/'){
            return;
        }
        var token = localStorage.getItem('token');
        var user =  getUserFromLocalStorage();
        if (token && user) {
            setUserRole(user.Role());
        }
    }, [])
    return (
        <div style={{ backgroundColor: '#000000'}}>
            <Nav style={{ borderBottom: '3px solid #b0b0b0',flex:1,width:"100%", height:"100%" }} >
                {userRole === 'Admin' && (
                    <Nav.Item>

                        <Link to='/home/admin/EventLogs' className={` nav-link  ${location.pathname === '/home/admin/EventLogs' ? 'active link-light ' : 'link-light hoverLink '}`}>
                        <h3>Event Logs</h3>
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Admin' && (
                    <Nav.Item>

                        <Link to='/home/admin/blockUser' className={`nav-link  ${location.pathname === '/home/admin/blockUser' ? 'active link-light' : 'link-light hoverLink '}`}>
                        <h3>Block Users</h3>
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'Admin' && (
                    <Nav.Item>

                        <Link to='/home/admin/stations' className={`nav-link  ${location.pathname === '/home/admin/stations' ? 'active link-light' : 'link-light hoverLink '}`}>
                            <h3>Stations</h3>
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'User' && (
                    <Nav.Item>
                        <Link to='/home/map' className={`nav-link  ${location.pathname === '/home/map' ? 'active link-light' : 'link-light hoverLink '}`}>
                        <h3>EV Station Map</h3>
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'User' && (
                    <Nav.Item>
                        <Link to='/home/addVehicle' className={`nav-link  ${location.pathname === '/home/addVehicle' ? 'active link-light' : 'link-light hoverLink '}`}>
                        <h3>Add Vehicle</h3>
                        </Link>
                    </Nav.Item>

                )}
                {userRole && (
                    <Nav.Item>
                        <Link to='/home/profile' className={`nav-link  ${location.pathname === '/home/profile' ? 'active link-light' : 'link-light hoverLink '}`}>
                        <h3>Edit Profile</h3>
                        </Link>
                    </Nav.Item>
                )}
                {userRole && (
                    <Nav.Item>
                        <Link to='/home/changePassword' className={`nav-link  ${location.pathname === '/home/changePassword' ? 'active link-light' : 'link-light hoverLink '}`}>
                        <h3>Change password</h3>
                        </Link>
                    </Nav.Item>

                )}
                {userRole && (
                    <Nav.Item className="ms-auto">
                        <Button variant="outline-success" onClick={logout} className='btn btn-link link-light text-decoration-none'>
                        <h3>Log out</h3>
                        </Button>
                    </Nav.Item>

                )}
            </Nav>
        </div>
     
    )
}
export default Header;