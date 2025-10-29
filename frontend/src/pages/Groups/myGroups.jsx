import React, { useMemo, useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import "./MyGroups.css";

// previously a static seed; we'll fetch groups from the backend instead
const seedGroups = [];

export default function MyGroups() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState(seedGroups);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.groups.getAllGroups}`);
        if (!res.ok) throw new Error('Failed to load groups');
        const body = await res.json();
        // server returns groups in body.data or body
        const raw = body.data || body || [];
        const mapped = (raw || []).map((g) => ({
          id: g._id,
          name: g.name,
          avatar: g.coverImageUrl || g.avatar || 'https://via.placeholder.com/120x120.png?text=Group',
          members: Array.isArray(g.members) ? g.members.length : (g.membersCount || 0),
          privacy: (g.privacy || 'public').toString().charAt(0).toUpperCase() + (g.privacy || 'public').toString().slice(1),
          about: g.bio || g.description || ''
        }));
        if (mounted) setGroups(mapped);
      } catch (err) {
        console.error('Load groups error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchGroups();
    return () => { mounted = false; };
  }, []);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    privacy: "Public",
    about: "",
    groupPicture: ""
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.about.toLowerCase().includes(q)
    );
  }, [groups, query]);

  const createGroup = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newGroup = {
      id: `g${Date.now()}`,
      name: form.name.trim(),
      avatar:
        form.groupPicture.trim() ||
        "https://via.placeholder.com/120x120.png?text=Group",
      members: 1,
      privacy: form.privacy,
      about: form.about.trim() || "New group"
    };
    setGroups([newGroup, ...groups]);
    setForm({ name: "", privacy: "Public", about: "", groupPicture: "" });
    setCreating(false);
  };

  return (
    <div className="groups">
      <div className="groups__top">
        <h2>My Groups</h2>

        <div className="groups__actions">
          <div className="groups__search">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="m21.71 20.29l-3.4-3.39A8.94 8.94 0 0 0 19 11a9 9 0 1 0-9 9a8.94 8.94 0 0 0 5.9-2.69l3.39 3.4a1 1 0 0 0 1.42-1.42zM4 11a7 7 0 1 1 7 7a7 7 0 0 1-7-7z"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search my groups"
            />
          </div>

          <button
            className="btn btn--primary"
            onClick={() => setCreating(true)}
          >
            + Create Group
          </button>
        </div>
      </div>
      <div className="groups__list">
        {loading && <div className="groups__loading">Loading groups…</div>}
        {filtered.map((g) => (
          <GroupRow
            key={g.id}
            group={g}
            onOpen={() => console.log("open group", g.id)}
            onLeave={() => alert(`(mock) Left "${g.name}"`)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="groups__empty">
            No groups found{query ? ` for “${query}”` : ""}.
          </div>
        )}
      </div>
      {creating && (
        <div
          className="groups__modal"
          onClick={() => setCreating(false)}
        >
          <div
            className="groups__dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create a Group</h3>
            <form className="groups__form" onSubmit={createGroup}>
              <label className="label">
                Name
                <input
                  placeholder="e.g., STOL Lovers"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label className="label">
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

              <label className="label">
                About
                <textarea
                  rows={3}
                  placeholder="What is this group about?"
                  value={form.about}
                  onChange={(e) =>
                    setForm({ ...form, about: e.target.value })
                  }
                />
              </label>

              <label className="label" htmlFor="profileImage">
                Add Profile Image
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setForm({ ...form, groupPicture: url });
                  }
                }}
              />

              {form.groupPicture && (
                <img
                  src={form.groupPicture}
                  alt="Group preview"
                  className="group__preview"
                />
              )}

              <div className="dialog__actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setForm({
                      name: "",
                      privacy: "Public",
                      about: "",
                      groupPicture: ""
                    });
                    setCreating(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GroupRow({ group, onOpen, onLeave }) {
  return (
    <div className="group card" role="button" onClick={onOpen}>
      <img
        className="group__avatar"
        src={group.avatar}
        alt={`${group.name} cover`}
      />
      <div className="group__main">
        <div className="group__name">{group.name}</div>
        <div className="group__meta">
          <span>{group.members} members</span>
          <span>•</span>
          <span>{group.privacy}</span>
        </div>
        <div className="group__about">{group.about}</div>
      </div>
      <div className="group__actions">
        <button
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            onLeave?.();
          }}
        >
          Leave
        </button>
      </div>
    </div>
  );
}