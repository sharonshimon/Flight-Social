import React, { useEffect, useState } from "react";
import "./FollowersModal.css";
import axiosInstance from "../../services/axiosService";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";

export default function FollowersModal({ userId, type, onClose }) {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendsIds, setFriendsIds] = useState([]);
    const navigate = useNavigate();
    const storedUserId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await axiosInstance.get(API_ENDPOINTS.users.getFriends(storedUserId));
                setFriendsIds(res.data.friends.map(f => f._id));
            } catch (err) {
                console.error("Failed to fetch friends:", err);
            }
        };
        fetchFriends();
    }, [storedUserId]);

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            try {
                const endpoint = type === "followers"
                    ? API_ENDPOINTS.users.getFollowers(userId)
                    : API_ENDPOINTS.users.getFriends(userId); // following = friends
                const res = await axiosInstance.get(endpoint);
                setList(res.data[type] || res.data.friends || []);
            } catch (err) {
                console.error("Failed to load list:", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId && type) fetchList();
    }, [userId, type]);

    const handleFollowToggle = async (targetId) => {
        try {
            const isFollowing = friendsIds.includes(targetId);
            const endpoint = isFollowing
                ? `/api/v1/users/unfollow/${targetId}`
                : `/api/v1/users/follow/${targetId}`;
            await axiosInstance.put(endpoint);
            // Update local friendsIds state
            setFriendsIds(prev =>
                isFollowing ? prev.filter(id => id !== targetId) : [...prev, targetId]
            );
        } catch (err) {
            console.error("Failed to toggle follow:", err);
        }
    };

    return (
        <div className="followers-modal-overlay" onClick={onClose}>
            <div className="followers-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{type === "followers" ? "Followers" : "Following"}</h3>
                <button className="close-btn" onClick={onClose}>✖</button>
                {loading ? (
                    <p>Loading...</p>
                ) : list.length === 0 ? (
                    <p>No {type} yet</p>
                ) : (
                    <ul>
                        {list.map(u => {
                            const isFollowing = friendsIds.includes(u._id);
                            return (
                                <li key={u._id}>
                                    <img
                                        src={u.profilePicture || "/default-avatar.jpg"}
                                        alt=""
                                        onClick={() => navigate(`/profile/${u._id}`)}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <span
                                        onClick={() => navigate(`/profile/${u._id}`)}
                                        style={{ cursor: "pointer", fontWeight: 500 }}
                                    >
                                        {u.username}
                                    </span>
                                    {u._id !== storedUserId && (
                                        <button
                                            onClick={() => handleFollowToggle(u._id)}
                                            style={{
                                                marginLeft: "auto",
                                                padding: "4px 8px",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                background: isFollowing ? "#fff" : "#0095f6",
                                                color: isFollowing ? "#000" : "#fff",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
