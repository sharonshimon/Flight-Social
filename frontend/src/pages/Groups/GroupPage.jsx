import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import groupService from "../../services/groupService";
import postService from "../../services/postService";
import defaultCover from "../../assets/photoplaceholder.jpg";
import "./GroupPage.css";
import Posts from "../../components/postsComponents/Posts";

export default function GroupPage() {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joining, setJoining] = useState(false);

    const currentUser = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('user')) || null; } catch (e) { return null; }
    }, []);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await groupService.getGroupById(id);
                // normalize fields for the UI
                const mapped = {
                    _id: data._id || data.id,
                    name: data.name,
                    bio: data.bio || data.description || data.about || '',
                    coverImageUrl: data.coverImageUrl || data.coverUrl || '',
                    avatar: data.coverImageUrl || data.avatar || '',
                    members: Array.isArray(data.members) ? data.members : (data.membersCount ? Array(data.membersCount) : []),
                    privacy: data.privacy || 'public',
                    creator: data.creator || null,
                };
                setGroup(mapped);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load group");
            } finally {
                setLoading(false);
            }
        };
        fetchGroup();
    }, [id]);

    const isMember = (grp) => {
        if (!grp) return false;
        const members = grp.members || [];
        // members may be an array of objects or array length placeholder; look for currentUser id
        if (!currentUser) return false;
        return members.some(m => {
            if (!m) return false;
            if (typeof m === 'string') return m === currentUser._id || m === currentUser.id;
            if (m.user) return String(m.user) === String(currentUser._id || currentUser.id);
            if (m._id) return String(m._id) === String(currentUser._id || currentUser.id);
            return false;
        });
    };

    const handleJoin = async () => {
        if (!group) return;
        setJoining(true);
        try {
            const res = await groupService.joinGroup(id);
            // server returns { group, status }
            const { group: updatedGroup, status } = res;
            // normalize as earlier
            const mapped = {
                _id: updatedGroup._id || updatedGroup.id,
                name: updatedGroup.name,
                bio: updatedGroup.bio || updatedGroup.description || updatedGroup.about || '',
                coverImageUrl: updatedGroup.coverImageUrl || updatedGroup.coverUrl || '',
                avatar: updatedGroup.coverImageUrl || updatedGroup.avatar || '',
                members: Array.isArray(updatedGroup.members) ? updatedGroup.members : (updatedGroup.membersCount ? Array(updatedGroup.membersCount) : []),
                privacy: updatedGroup.privacy || 'public',
                creator: updatedGroup.creator || null,
            };
            setGroup(mapped);
            alert(status === 'joined' ? 'You joined the group' : 'Join request sent');
        } catch (err) {
            console.error('Join group failed', err);
            alert(err?.response?.data?.message || err.message || 'Could not join group');
        } finally {
            setJoining(false);
        }
    };

    // New post state
    const [postContent, setPostContent] = useState('');
    const [postFiles, setPostFiles] = useState([]);
    const [posting, setPosting] = useState(false);

    const onFilesPicked = (e) => {
        const arr = Array.from(e.target.files || []);
        const valid = arr.filter(f => /image\//.test(f.type));
        setPostFiles(prev => [...prev, ...valid]);
    };

    const removeFile = (idx) => {
        setPostFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!postContent.trim() && postFiles.length === 0) return alert('Write something or attach an image');
        setPosting(true);
        try {
            const fd = new FormData();
            fd.append('content', postContent.trim());
            fd.append('group', id);
            postFiles.forEach((f, i) => fd.append('media', f, f.name || `media_${i}`));
            const created = await postService.createPost(fd);
            // created is likely { data: newPost, message }
            const postObj = created?.data || created;
            alert('Post created');
            setPostContent('');
            setPostFiles([]);
            // optionally notify other components (Posts listens for this)
            try { window.dispatchEvent(new CustomEvent('post-created', { detail: postObj })); } catch (e) { }
        } catch (err) {
            console.error('Create group post failed', err?.response?.data || err.message);
            alert(err?.response?.data?.message || err.message || 'Failed to create post');
        } finally {
            setPosting(false);
        }
    };

    if (loading) return <div className="group-loading">Loading...</div>;
    if (error) return <div className="group-error">{error}</div>;
    if (!group) return null;

    return (
        <div className="group-page">
            <div className="group-card">

                <div className="group-header">
                    <img
                        className="group-cover"
                        src={group.coverImageUrl || defaultCover}
                        alt="Group cover"
                    />
                </div>

                <div className="group-body">
                    <aside className="group-sidebar">
                        <div className="group-info">
                            <img
                                className="group-avatar"
                                src={group.avatar || defaultCover}
                                alt={group.name}
                            />
                            <div className="group-meta">
                                <h2 className="group-name">{group.name}</h2>
                                <p className="group-bio">{group.bio || "No description yet"}</p>
                                <p className="group-members">{group.members?.length || 0} members</p>
                            </div>
                        </div>

                        <div className="group-actions">
                            {isMember(group) ? (
                                <button className="join-btn" onClick={async (e) => {
                                    e.stopPropagation(); /* implement leave */
                                    try {
                                        const resp = await groupService.leaveGroup(id);
                                        const updated = resp.group || resp;
                                        const mapped = {
                                            _id: updated._id || updated.id,
                                            name: updated.name,
                                            bio: updated.bio || updated.description || updated.about || '',
                                            coverImageUrl: updated.coverImageUrl || updated.coverUrl || '',
                                            avatar: updated.coverImageUrl || updated.avatar || '',
                                            members: Array.isArray(updated.members) ? updated.members : (updated.membersCount ? Array(updated.membersCount) : []),
                                            privacy: updated.privacy || 'public',
                                            creator: updated.creator || null,
                                        };
                                        setGroup(mapped);
                                        alert('Left group');
                                    } catch (err) {
                                        console.error('Leave group failed', err);
                                        alert(err?.response?.data?.message || err.message || 'Could not leave group');
                                    }
                                }}>Leave Group</button>
                            ) : (
                                <button className="join-btn" onClick={(e) => { e.stopPropagation(); handleJoin(); }} disabled={joining}>{joining ? 'Joining…' : 'Join Group'}</button>
                            )}
                            <button className="invite-btn">Invite</button>
                        </div>

                        {/* New post form placed under the rest of the text in the sidebar */}
                        <form className="group-new-post" onSubmit={handleCreatePost}>
                            <textarea
                                className="group-post-text"
                                placeholder={`Share something with ${group.name}...`}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                rows={3}
                            />
                            <div className="group-post-controls">
                                {/* hidden file input with a visible label styled as a button */}
                                <input id="group-media-input" type="file" accept="image/*" multiple onChange={onFilesPicked} style={{ display: 'none' }} />
                                <label htmlFor="group-media-input" className="file-btn">Attach</label>
                                <button type="submit" className="post-btn" disabled={posting}>{posting ? 'Posting…' : 'Post'}</button>
                            </div>

                            {postFiles.length > 0 && (
                                <div className="post-previews">
                                    {postFiles.map((f, i) => (
                                        <div className="preview" key={i}>
                                            <img src={URL.createObjectURL(f)} alt={f.name} />
                                            <button type="button" className="remove-file" onClick={() => removeFile(i)}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </form>
                    </aside>

                    <main className="group-feed">
                        <h3>Group Posts</h3>
                        <Posts filters={{ group: id }} />
                    </main>
                </div>
            </div>
        </div>
    );
}