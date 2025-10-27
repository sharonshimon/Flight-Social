import React, { useState, useEffect, useMemo } from "react";
import "./Friends.css";
import FriendsHeader from "./FriendsHeader";
import FriendsGrid from "./FriendsGrid";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import { useNavigate } from "react-router-dom";

export default function Friends({ userId }) {
  const [query, setQuery] = useState("");
  const [friendsData, setFriendsData] = useState([]);
  const [myFollowings, setMyFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const storedUserId = userId || localStorage.getItem("userId");

  useEffect(() => {
    const fetchFriendsWithMutuals = async () => {
      if (!storedUserId) return;
      setLoading(true);

      try {
        // my list of friends
        const myRes = await axiosInstance.get(API_ENDPOINTS.users.getFriends(storedUserId));
        const myFollowingsIds = myRes.data.friends?.map(f => f._id) || [];
        setMyFollowings(myFollowingsIds);
        console.log("My followings IDs:", myFollowingsIds);

        // my friends result
        const friendsRes = await axiosInstance.get(API_ENDPOINTS.users.getFriends(storedUserId));
        const friendsList = friendsRes.data.friends || [];

        // for each friend , check their followers
        const friendsWithMutuals = await Promise.all(friendsList.map(async (f) => {
          const fRes = await axiosInstance.get(API_ENDPOINTS.users.getFriends(f._id));
          const friendFollowings = fRes.data.friends?.map(ff => ff._id) || [];

          console.log("Friend:", f.username);
          console.log("Friend followings:", friendFollowings);
          console.log("My followings:", myFollowingsIds);

          const mutualsCount = friendFollowings.filter(fid => myFollowingsIds.includes(fid)).length;
          console.log("Mutuals count:", mutualsCount);

          return {
            id: f._id,
            name: f.username,
            handle: `@${f.username}`,
            avatar: f.profilePicture || "/default-avatar.jpg",
            mutuals: mutualsCount,
          };
        }));

        setFriendsData(friendsWithMutuals);

      } catch (err) {
        console.error("Failed to fetch friends with mutuals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsWithMutuals();
  }, [storedUserId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friendsData;
    return friendsData.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.handle.toLowerCase().includes(q)
    );
  }, [friendsData, query]);

  return (
    <div className="buddies">
      <FriendsHeader query={query} setQuery={setQuery} />

      {loading ? (
        <div className="buddies__empty">Loading friends...</div>
      ) : filtered.length > 0 ? (
        <FriendsGrid
          friends={filtered}
          onUserClick={(id) => navigate(`/profile/${id}`)}
        />
      ) : (
        <div className="buddies__empty">No friends found.</div>
      )}
    </div>
  );
}
