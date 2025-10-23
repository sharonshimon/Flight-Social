import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./RightBar.css";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import SuggestionUser from "./SuggestionUser";
import OnlineFriend from "./OnlineFriend";

const STORAGE_KEY = "rightbar-minimized";

const RightBar = () => {
  const [minimized, setMinimized] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  });

  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [followingIds, setFollowingIds] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    setCurrentUser(user);
    setFollowingIds(user.following || []);

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.users.getAllUsers);
        const data = res.data?.data || [];
        setAllUsers(data);
        setUsers(data.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const isFollowing = followingIds.includes(userId);
      const endpoint = isFollowing
        ? API_ENDPOINTS.users.unfollow(userId)
        : API_ENDPOINTS.users.follow(userId);

      const res = await axiosInstance.put(endpoint, { currentUserId: currentUser._id });

      if (res.status === 200) {
        const updatedFollowing = isFollowing
          ? followingIds.filter(id => id !== userId)
          : [...followingIds, userId];

        setFollowingIds(updatedFollowing);

        setTimeout(async () => {
          let updatedUsers;
          if (isFollowing) {
            const unfollowedUser = users.find(u => u._id === userId) || allUsers.find(u => u._id === userId);
            updatedUsers = [...users, unfollowedUser];
          } else {
            updatedUsers = users.filter(u => u._id !== userId);
          }

          const updatedUser = { ...currentUser, following: updatedFollowing };
          setCurrentUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUsers(updatedUsers);

          // update profile stats
          try {
            const profileRes = await axiosInstance.get(
              API_ENDPOINTS.users.getById.replace(":id", currentUser._id)
            );

            if (profileRes?.data?.userInfo) {
              const userInfo = profileRes.data.userInfo;

              window.dispatchEvent(
                new CustomEvent("profile-stats-updated", {
                  detail: {
                    followersCount: userInfo.followers?.length || 0,
                    followingCount: userInfo.following?.length || 0,
                  },
                })
              );
            }
          } catch (err) {
            console.error("Error fetching updated user info:", err);
          }

          window.dispatchEvent(
            new CustomEvent("follow-change", {
              detail: { targetUserId: userId, isFollowing: !isFollowing },
            })
          );
        }, 3000);
      } else {
        console.error("Failed to follow/unfollow user");
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  const toggleMinimized = () => {
    setMinimized((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, newValue ? "1" : "0");
      } catch (e) { }
      return newValue;
    });
  };

  return (
    <>
      <div className={`rightBar${minimized ? " minimized" : ""}`}>
        <div className="container">
          <div className="menu"></div>

          <div className="item">
            <span>Suggestions For You</span>
            {users.slice(0, 3).map((user) => (
              <SuggestionUser
                key={user._id}
                img={
                  user.profilePicture || "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                }
                name={user.username}
                onFollow={() => handleFollow(user._id)}
                isFollowing={followingIds.includes(user._id)}
              />
            ))}
          </div>

          <div className="item">
            <span>Latest Activities</span>
            {[...Array(3)].map((_, i) => (
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
          </div>

          <div className="item">
            <span>Online Friends</span>
            <div className="onlineFriendsScroll">
              {onlineFriends.map((u) => (
                <OnlineFriend
                  key={u._id}
                  img={u.profilePicture}
                  name={u.username}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        className="rightbar-fab"
        onClick={toggleMinimized}
        title={minimized ? "Expand" : "Minimize"}
        aria-label="Toggle right bar"
      >
        <MenuIcon style={{ fontSize: 20 }} />
      </button>
    </>
  );
};

export default RightBar;
