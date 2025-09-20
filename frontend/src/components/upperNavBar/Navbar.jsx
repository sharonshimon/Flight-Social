import "./navbar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";

const Navbar = () => {
  const currentUser = {
    name: "Aviator",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  return (
    <div className="navbar">
      <div className="left">
        {/* If "/" goes to login, point the logo to /feed instead */}
        <Link to="/feed" style={{ textDecoration: "none" }}>
          <span>Flight Social</span>
        </Link>
        <Link to="/feed" aria-label="Home">
          <HomeOutlinedIcon />
        </Link>
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <NotificationsOutlinedIcon />
        <Link to="/profile" className="user" aria-label="Open profile">
          <img src={currentUser.profilePic} alt={`${currentUser.name} avatar`} />
          <span>{currentUser.name}</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
