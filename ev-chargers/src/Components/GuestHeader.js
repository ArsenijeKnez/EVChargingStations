import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

function Header() {
  const location = useLocation();

  return (
    <div style={{ backgroundColor: "#000000" }}>
      <Nav style={{ borderBottom: "3px solid #b0b0b0" }}>
        <Nav.Item>
          <Link
            to="/"
            className={` nav-link  ${
              location.pathname === "/"
                ? "active link-light "
                : "link-light hoverLink "
            }`}
          >
            <h3>EV Station Map</h3>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/login"
            className={`nav-link  ${
              location.pathname === "/login"
                ? "active link-light"
                : "link-light hoverLink "
            }`}
          >
            <h3>Login</h3>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link
            to="/register"
            className={`nav-link  ${
              location.pathname === "/register"
                ? "active link-light"
                : "link-light hoverLink "
            }`}
          >
            <h3>Register</h3>
          </Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
export default Header;
