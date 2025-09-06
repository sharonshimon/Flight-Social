import MenuIcon from "@mui/icons-material/Menu";

import { useState } from "react";

import "./leftbar.css";

// Flight/travel-related SVG icons (public domain or open source)
const icons = {
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
};

const LeftBar = () => {
  const [minimized, setMinimized] = useState(false);
  // Mock user for demo
  const currentUser = {
    name: "Aviator",
    profilePic: icons.Courses
  };

  return (
    <div className={`leftBar${minimized ? " minimized" : ""}`}>
      <div className="container">
        <div className="menu">
          {minimized ? null : (
            <div className="user" style={{display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <img src={currentUser.profilePic} alt="" />
                <span>{currentUser.name}</span>
              </div>
              <button className="minimize-btn" onClick={() => setMinimized((m) => !m)} title={minimized ? "Expand" : "Minimize"}>
                <MenuIcon />
              </button>
            </div>
          )}
      {minimized && (
        <button className="minimize-btn" style={{position: 'absolute', top: 6, right: 18, zIndex: 10}} onClick={() => setMinimized((m) => !m)} title="Expand">
          <MenuIcon />
        </button>
      )}
          <div className="item"><img src={icons.Friends} alt="" /><span>Flight Buddies</span></div>
          <div className="item"><img src={icons.Groups} alt="" /><span>Airports</span></div>
          <div className="item"><img src={icons.Market} alt="" /><span>Travel Shop</span></div>
          <div className="item"><img src={icons.Watch} alt="" /><span>Flight Watch</span></div>
          <div className="item"><img src={icons.Memories} alt="" /><span>Cloud Memories</span></div>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <div className="item"><img src={icons.Events} alt="" /><span>Events</span></div>
          <div className="item"><img src={icons.Gaming} alt="" /><span>Flight Games</span></div>
          <div className="item"><img src={icons.Gallery} alt="" /><span>Gallery</span></div>
          <div className="item"><img src={icons.Videos} alt="" /><span>Videos</span></div>
          <div className="item"><img src={icons.Messages} alt="" /><span>Messages</span></div>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <div className="item"><img src={icons.Fund} alt="" /><span>Fundraiser</span></div>
          <div className="item"><img src={icons.Tutorials} alt="" /><span>Tutorials</span></div>
          <div className="item"><img src={icons.Courses} alt="" /><span>Flight Courses</span></div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
