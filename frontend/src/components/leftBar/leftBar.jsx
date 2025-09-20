import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";             // ⬅️ add this
import MenuIcon from "@mui/icons-material/Menu";
import "./leftbar.css";
import LeftBarItem from "./leftBarItem";

const LeftBar = () => {
  const [minimized, setMinimized] = useState(false);

  const icons = useMemo(() => ({
    Friends: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/people.svg",
    Memories: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/cloud.svg",
    Gallery: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/image.svg",
    Messages: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/chat.svg",
    Courses: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/airplane.svg",
  }), []);

  const mainMenuItems = useMemo(() => [
    { icon: icons.Friends,  name: "Flight Buddies", path: "/friends" },
    { icon: icons.Messages, name: "Messages",       path: "/messages" },
    { icon: icons.Gallery,  name: "New Post",       path: "/NewPost" },
    { icon: icons.Memories, name: "My Groups",      path: "/myGroups" },
  ], [icons]);

  const currentUser = useMemo(() => ({
    id: "me",                           // <-- use your real id if you have one
    name: "Aviator",
    profilePic: icons.Courses
  }), [icons.Courses]);

  const toggleMinimized = () => setMinimized(prev => !prev);

  const renderMenuItems = (items) =>
    items.map((item) => (
      <LeftBarItem key={item.path} icon={item.icon} name={item.name} path={item.path} />
    ));

  return (
    <div className={`leftBar${minimized ? " minimized" : ""}`}>
      <div className="container">
        <div className="menu">
          {!minimized && (
            <div className="user">
              <Link
                to={`/profile`} 
                className="user-info"
                aria-label="Open profile"
              >
                <img
                  src={currentUser.profilePic}
                  alt={`${currentUser.name} avatar`}
                  className="user-avatar"
                />
                <span className="user-name">{currentUser.name}</span>
              </Link>

              {/* keep the minimize button separate (not inside the Link) */}
              <button
                className="minimize-btn"
                onClick={toggleMinimized}
                title="Minimize sidebar"
                aria-label="Minimize sidebar"
              >
                <MenuIcon />
              </button>
            </div>
          )}

          {minimized && (
            <button
              className="minimize-btn minimize-btn--expanded"
              onClick={toggleMinimized}
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <MenuIcon />
            </button>
          )}

          {renderMenuItems(mainMenuItems)}
        </div>
        <hr />
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
