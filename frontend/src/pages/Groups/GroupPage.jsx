import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import defaultCover from "../../assets/photoplaceholder.jpg";
import "./GroupPage.css";

export default function GroupPage() {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await groupService.getGroupById(id);
                setGroup(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load group");
            } finally {
                setLoading(false);
            }
        };
        fetchGroup();
    }, [id]);

    if (loading) return <div className="group-loading">Loading...</div>;
    if (error) return <div className="group-error">{error}</div>;
    if (!group) return null;

    return (
        <div className="group-page">
            <div className="group-header">
                <img
                    className="group-cover"
                    src={group.coverImageUrl || defaultCover}
                    alt="Group cover"
                />
                <div className="group-info">
                    <img
                        className="group-avatar"
                        src={group.avatar || defaultCover}
                        alt={group.name}
                    />
                    <div>
                        <h2 className="group-name">{group.name}</h2>
                        <p className="group-bio">{group.bio || "No description yet"}</p>
                        <p className="group-members">
                            {group.members?.length || 0} members
                        </p>
                    </div>
                </div>
            </div>

            <div className="group-actions">
                <button className="join-btn">Join Group</button>
                <button className="invite-btn">Invite</button>
            </div>

            <div className="group-feed">
                {/* כאן בהמשך נציג את פוסטים של הקבוצה */}
                <h3>Group Posts</h3>
                <p>Coming soon...</p>
            </div>
        </div>
    );
}
