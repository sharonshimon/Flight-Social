import "./navbar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import NotificationsMenu from "./NotificationsMenu";
import NavBarSearch from "./NavBarSearch";
const Navbar = () => {
  const [openNotif, setOpenNotif] = useState(false);

  // user info
  let currentUser = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      currentUser = {
        name: userObj.username || userObj.firstName || "User",
        profilePic:
          userObj.profilePicture || "https://randomuser.me/api/portraits/men/32.jpg",
      };
    }
  } catch (e) {
    currentUser = null;
  }

  if (!currentUser) {
    currentUser = {
      name: "Guest",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    };
  }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/feed" style={{ textDecoration: "none" }}>
          <span>Flight Social</span>
        </Link>
        <Link to="/feed" aria-label="Home">
          <HomeOutlinedIcon />
        </Link>

        {/* קומפוננטת החיפוש */}
        <NavBarSearch />
      </div>

      <div className="right">
        <button
          className="icon-btn notif-btn"
          aria-label="Open notifications"
          onClick={() => setOpenNotif((v) => !v)}
        >
          <NotificationsOutlinedIcon />
          <span className="badge" aria-hidden="true" />
        </button>

        <div className="notif-anchor">
          {openNotif && <NotificationsMenu onClose={() => setOpenNotif(false)} />}
        </div>

        <Link to="/profile" className="user" aria-label="Open profile">
          <img src={currentUser.profilePic} alt={`${currentUser.name} avatar`} />
          <span>{currentUser.name}</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
