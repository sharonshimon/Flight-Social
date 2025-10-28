import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../services/axiosService";
import { API_ENDPOINTS } from "../../config/api";
import defaultGroupImg from "../../assets/photoplaceholder.jpg";
import "./ExploreGroups.css";

const ExploreGroups = () => {
    const [groups, setGroups] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [privacyFilter, setPrivacyFilter] = useState("all");
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({
        name: "",
        privacy: "Public",
        bio: "",
        coverImageUrl: null,
    });
    const [previewImage, setPreviewImage] = useState("");
    const [showMyGroups, setShowMyGroups] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        fetchGroups();
    }, [showMyGroups]);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            let res;
            if (showMyGroups && user?._id) {
                // fetch only user's groups
                res = await axiosInstance.get(
                    API_ENDPOINTS.groups.getGroupsByUserId(user._id)
                );
            } else {
                // fetch all groups
                res = await axiosInstance.get(API_ENDPOINTS.groups.getAllGroups);
            }
            setGroups(res.data.groups || []);
        } catch (err) {
            console.error("Failed to load groups:", err);
        } finally {
            setLoading(false);
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

    const filteredGroups = useMemo(() => {
        const q = query.trim().toLowerCase();
        return groups.filter((g) => {
            const matchesName = g.name.toLowerCase().includes(q);
            const matchesPrivacy =
                privacyFilter === "all" ||
                g.privacy.toLowerCase() === privacyFilter.toLowerCase();
            return matchesName && matchesPrivacy;
        });
    }, [groups, query, privacyFilter]);

    const handleJoinGroup = async (groupId) => {
        try {
            const res = await axiosInstance.post(
                API_ENDPOINTS.groups.joinGroup(groupId),
                { userId: user._id }
            );
            const { group } = res.data;
            setGroups((prev) => prev.map((g) => (g._id === group._id ? group : g)));
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, coverImageUrl: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("bio", form.bio);
            formData.append("privacy", form.privacy.toLowerCase());
            if (form.coverImageUrl) {
                formData.append("image", form.coverImageUrl);
            }

            const res = await axiosInstance.post(
                API_ENDPOINTS.groups.createGroup,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data?.group) {
                setGroups((prev) => [res.data.group, ...prev]);
            }

            setForm({ name: "", privacy: "Public", bio: "", coverImageUrl: null });
            setPreviewImage("");
            setCreating(false);
        } catch (err) {
            console.error("Failed to create group:", err.response || err);
            alert("Failed to create group. Please try again.");
        }
    };

    if (loading) return <p>Loading groups...</p>;

    return (
        <div className="explore-groups-page">
            <div className="groups-top">
                <h2 className="explore-title">🌍 Explore Groups</h2>

                <div className="groups-controls">
                    <div className="groups-search">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="m21.71 20.29l-3.4-3.39A8.94 8.94 0 0 0 19 11a9 9 0 1 0-9 9a8.94 8.94 0 0 0 5.9-2.69l3.39 3.4a1 1 0 0 0 1.42-1.42zM4 11a7 7 0 1 1 7 7a7 7 0 0 1-7-7z"
                            />
                        </svg>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Groups..."
                        />
                    </div>

                    <select
                        value={privacyFilter}
                        onChange={(e) => setPrivacyFilter(e.target.value)}
                        className="privacy-filter"
                    >
                        <option value="all">All</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>

                    <div className="switch-container">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={showMyGroups}
                                onChange={() => setShowMyGroups(!showMyGroups)}
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="switch-label">
                            {showMyGroups ? "My Groups" : "All Groups"}
                        </span>
                    </div>

                    <button className="join-btn" onClick={() => setCreating(true)}>
                        + Create Group
                    </button>
                </div>
            </div>

            <div className="groups-container">
                {filteredGroups.length === 0 ? (
                    <div>No groups found for this search.</div>
                ) : (
                    filteredGroups.map((group) => (
                        <div key={group._id} className="group-card">
                            <img
                                src={group.coverImageUrl || defaultGroupImg}
                                alt={group.name}
                                className="group-img"
                            />
                            <h3>{group.name}</h3>
                            <p className="group-bio">{group.bio || "No description"}</p>
                            <p className="members-count">
                                {group.members?.length || 0} members • {group.privacy}
                            </p>

                            <div className="group-actions">
                                {isMember(group) ? (
                                    <button
                                        className="leave-btn"
                                        onClick={() => handleLeaveGroup(group._id)}
                                    >
                                        Leave
                                    </button>
                                ) : group.privacy === "private" && hasRequested(group) ? (
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
                        </div>
                    ))
                )}
            </div>

            {creating && (
                <div className="groups-modal" onClick={() => setCreating(false)}>
                    <div
                        className="groups-dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Create a Group</h3>
                        <form className="groups-form" onSubmit={handleCreateGroup}>
                            <label>
                                Name
                                <input
                                    placeholder="e.g., Flight Buddies TLV"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Privacy
                                <select
                                    value={form.privacy}
                                    onChange={(e) =>
                                        setForm({ ...form, privacy: e.target.value })
                                    }
                                >
                                    <option>Public</option>
                                    <option>Private</option>
                                </select>
                            </label>

                            <label>
                                About
                                <textarea
                                    rows={3}
                                    placeholder="What is this group about?"
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm({ ...form, bio: e.target.value })
                                    }
                                />
                            </label>

                            <label htmlFor="groupImage">Add Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Group preview"
                                    className="group-img"
                                />
                            )}

                            <div className="dialog-actions">
                                <button
                                    type="button"
                                    className="leave-btn"
                                    onClick={() => {
                                        setForm({
                                            name: "",
                                            privacy: "Public",
                                            bio: "",
                                            coverImageUrl: null,
                                        });
                                        setPreviewImage("");
                                        setCreating(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="join-btn">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExploreGroups;
