import React, { useState, useMemo } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./leftbar.css";
import LeftBarItem from "./leftBarItem";

const LeftBar = () => {
  const [minimized, setMinimized] = useState(false);
  const icons = useMemo(() => ({
    Friends: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/people.svg",
    Groups: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt.svg",
    Market: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/bag.svg",
    Watch: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/binoculars.svg",
    Memories: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/cloud.svg",
    Events: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/calendar-event.svg",
    Gaming: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/controller.svg",
    Gallery: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/image.svg",
    Videos: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/camera-video.svg",
    Messages: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/chat.svg",
    Tutorials: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/mortarboard.svg",
    Courses: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/airplane.svg",
    Fund: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/cash-coin.svg",
  }), []);
  const mainMenuItems = useMemo(() => [
    { icon: icons.Friends, name: "Flight Buddies", path: "/friends" },
    { icon: icons.Groups, name: "Airports", path: "/airports" },
    { icon: icons.Market, name: "Travel Shop", path: "/shop" },
    { icon: icons.Watch, name: "Flight Watch", path: "/watch" },
    { icon: icons.Memories, name: "Cloud Memories", path: "/memories" }
  ], [icons]);

  const shortcutItems = useMemo(() => [
    { icon: icons.Events, name: "Events", path: "/events" },
    { icon: icons.Gaming, name: "Flight Games", path: "/games" },
    { icon: icons.Gallery, name: "Gallery", path: "/gallery" },
    { icon: icons.Videos, name: "Videos", path: "/videos" },
    { icon: icons.Messages, name: "Messages", path: "/messages" }
  ], [icons]);
  const currentUser = useMemo(() => ({
    name: "Aviator",
    profilePic: icons.Courses
  }), [icons.Courses]);

  const toggleMinimized = () => setMinimized(prev => !prev);

  const renderMenuItems = (items) =>
    items.map((item) => (
      <LeftBarItem
        key={item.path}
        icon={item.icon}
        name={item.name}
        path={item.path}
      />
    ));

  return (
    <div className={`leftBar${minimized ? " minimized" : ""}`}>
      <div className="container">
        <div className="menu">
          {!minimized && (
            <div className="user">
              <div className="user-info">
                <img
                  src={currentUser.profilePic}
                  alt={`${currentUser.name}'s profile`}
                  className="user-avatar"
                />
                <span className="user-name">{currentUser.name}</span>
              </div>
              <button
                className="minimize-btn"
                onClick={toggleMinimized}
                title="Minimize sidebar"
                aria-label="Minimize sidebar">
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
        <div className="menu">
          {!minimized && <span className="menu-title">Your shortcuts</span>}
          {renderMenuItems(shortcutItems)}
        </div>

        <hr />
      </div>
    </div>
  );
};

export default LeftBar;