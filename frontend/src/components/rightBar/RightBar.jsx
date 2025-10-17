import React, { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import "./rightbar.css";
import SuggestionUser from "./SuggestionUser";
import OnlineFriend from "./OnlineFriend";

const STORAGE_KEY = 'rightbar-minimized';

const RightBar = () => {
  const [minimized, setMinimized] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, minimized ? '1' : '0'); } catch (e) {}
  }, [minimized]);

  const toggleMinimized = () => setMinimized(prev => !prev);

  return (
    <>
      <div className={`rightBar${minimized ? ' minimized' : ''}`}> 
        <div className="container">
          <div className="menu">
              
            </div>
          

          {/* inline minimize button removed; FAB handles toggling */}

          <div className="item">
            <span>Suggestions For You</span>
            <SuggestionUser
              img="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              name="Jane Doe"
            />
            <SuggestionUser
              img="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              name="Jane Doe"
            />
          </div>
          <span>Latest Activities</span>
          {[...Array(4)].map((_, i) => (
            <div className="user" key={i}>
              <div className="userInfo">
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>
                  <span>Jane Doe</span> changed their cover picture
                </p>
              </div>
              <span>1 min ago</span>
            </div>
          ))}
          <div className="item">
            <span>Online Friends</span>
            <div className="onlineFriendsScroll">
              {[...Array(11)].map((_, i) => (
                <OnlineFriend
                  key={i}
                  img="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  name="Jane Doe"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Always show the FAB so user can toggle the right bar at any time */}
      <button className="rightbar-fab" onClick={() => setMinimized(prev => !prev)} title={minimized ? 'Expand' : 'Minimize'} aria-label="Toggle right bar">
        <MenuIcon style={{fontSize:20}} />
      </button>
    </>
  );
};

export default RightBar;