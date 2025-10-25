import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import defaultGroupImg from "../../assets/photoplaceholder.jpg";
import "./ExploreGroups.css";

const ExploreGroups = () => {
    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await axiosInstance.get(API_ENDPOINTS.groups.getAllGroups);
            setGroups(res.data.groups);
        } catch (err) {
            console.error("Failed to load groups:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            const res = await axiosInstance.post(
                API_ENDPOINTS.groups.joinGroup(groupId),
                { userId: user._id }
            );
            const { group } = res.data;

            setGroups((prev) =>
                prev.map((g) => (g._id === group._id ? group : g))
            );
        } catch (err) {
            console.error("Failed to join group:", err);
        }
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            const res = await axiosInstance.post(
                API_ENDPOINTS.groups.leaveGroup(groupId),
                { userId: user._id }
            );
            const updatedGroup = res.data.group;

            setGroups((prev) =>
                prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
            );
        } catch (err) {
            console.error("Failed to leave group:", err);
        }
    };

    const isMember = (group) =>
        group.members?.some(
            (m) => String(m.user._id || m.user) === String(user?._id)
        );

    const hasRequested = (group) =>
        group.joinRequests?.some(
            (r) => String(r.user._id || r.user) === String(user?._id)
        );

    if (loading) return <p>Loading groups...</p>;

    return (
        <div className="explore-groups-page">
            <h2>🌍 Explore Groups</h2>
            <div className="groups-container">
                {groups.length === 0 ? (
                    <p>No groups found.</p>
                ) : (
                    groups.map((group) => (
                        <div key={group._id} className="group-card">
                            <img
                                src={group.image || defaultGroupImg}
                                alt={group.name}
                                className="group-img"
                            />
                            <h3>{group.name}</h3>
                            <p>{group.bio || "No description available."}</p>
                            <p>{group.privacy}</p>
                            <p className="members-count">
                                👥 {group.members?.length || 0} members
                            </p>

                            {isMember(group) ? (
                                <button
                                    className="leave-btn"
                                    onClick={() => handleLeaveGroup(group._id)}
                                >
                                    Leave Group
                                </button>
                            ) : group.privacy === "private" &&
                                hasRequested(group) ? (
                                <button className="request-sent-btn" disabled>
                                    Request Sent
                                </button>
                            ) : (
                                <button
                                    className="join-btn"
                                    onClick={() => handleJoinGroup(group._id)}
                                >
                                    {group.privacy === "private"
                                        ? "Request to Join"
                                        : "Join Group"}
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExploreGroups;
