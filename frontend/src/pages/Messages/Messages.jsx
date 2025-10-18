import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Messages.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SendIcon from "@mui/icons-material/Send";
import ChatWindow from "../../components/Chat/ChatWindow";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";

export default function Messages() {
  const [query, setQuery] = useState("");
  const [activeConvo, setActiveConvo] = useState(null);
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchConvos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS?.chat?.list || '/api/v1/chat/conversations'}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load conversations');
        const body = await res.json();
        // body.data is expected to be an array of { _id: peerId, lastMessage, lastAt }
        const items = (body.data || []).map((it) => ({
          id: it._id,
          name: it.peerDisplayName || it.peerUsername || it._id,
          avatar: it.peerAvatar || '',
          lastAt: it.lastAt,
          lastMessage: it.lastMessage,
        }));
        setConvos(items);
        if (items.length) setActiveConvo(items[0]);
      } catch (err) {
        console.error('Load convos error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConvos();
  }, []);

  // start a new conversation
  const [newPeer, setNewPeer] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const startConversation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to start a conversation');
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.chat.start}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ peerUsername: newPeer, content: newMsg })
      });
      if (!res.ok) throw new Error('Failed to start conversation');
      const body = await res.json();
      // refresh convos
      const newConvo = { id: body.data.receiverId || body.data.receiverId, name: newPeer || body.data.receiverId, avatar: '' };
      setConvos((c) => [newConvo, ...c]);
      setActiveConvo(newConvo);
      setNewPeer('');
      setNewMsg('');
    } catch (err) {
      console.error('startConversation failed', err);
      alert('Could not start conversation');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return convos;
    return convos.filter((c) => (c.name || c.id).toLowerCase().includes(q) || (c.lastMessage || '').toLowerCase().includes(q));
  }, [convos, query]);

  const handleSelect = (c) => {
    setActiveConvo(c);
  };

  return (
    <div className="msgs">
      <aside className="msgs__list">
        <form className="msgs__new" onSubmit={startConversation}>
          <input value={newPeer} onChange={(e) => setNewPeer(e.target.value)} placeholder="peer username or id" />
          <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="first message (optional)" />
          <button type="submit">Start</button>
        </form>
        <div className="msgs__convos">
          {loading && <div className="msgs__loading">Loading…</div>}
          {filtered.map((c) => (
            <button
              key={c.id}
              className={`convo ${c.id === activeConvo?.id ? "is-active" : ""}`}
              onClick={() => handleSelect(c)}
              aria-current={c.id === activeConvo?.id ? "page" : undefined}
            >
              <img className="convo__avatar" src={c.avatar || '/favicon.ico'} alt={`${c.name || c.id} avatar`} />
              <div className="convo__main">
                <div className="convo__row">
                  <span className="convo__name">{c.name || c.id}</span>
                  <span className="convo__time">{c.lastAt}</span>
                </div>
                <div className="convo__row">
                  <span className="convo__preview">{c.lastMessage || 'No messages yet'}</span>
                </div>
              </div>
            </button>
          ))}
          {!loading && filtered.length === 0 && (
            <div className="msgs__empty">No conversations yet. Start a chat!</div>
          )}
        </div>
      </aside>
      <section className="msgs__thread">
        {activeConvo ? (
          <ChatWindow currentUser={currentUser} peerId={activeConvo.id} />
        ) : (
          <div className="msgs__placeholder">Select a conversation to start chatting</div>
        )}
      </section>
    </div>
  );
}

function ThreadHeader({ name, avatar }) {
  return (
    <header className="thread__header">
      <div className="thread__peer">
        <img className="thread__avatar" src={avatar} alt={`${name} avatar`} />
        <div className="thread__title">
          <h3>{name}</h3>
          <span className="thread__status">Online</span>
        </div>
      </div>
    </header>
  );
}

function ThreadMessages({ messages }) {
  const scrollerRef = useRef(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollerRef} className="thread__scroller">
      {messages.map((m) => (
        <div key={m.id} className={`bubble ${m.me ? "bubble--me" : ""}`}>
          {!m.me && <span className="bubble__author">{m.author}</span>}
          <p className="bubble__text">{m.text}</p>
          <span className="bubble__time">{m.at}</span>
        </div>
      ))}
    </div>
  );
}

function ThreadComposer({ onSend }) {
  const [value, setValue] = useState("");
  const send = () => {
    onSend?.(value);
    setValue("");
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="thread__composer">
      <textarea
        rows={1}
        placeholder="Message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button className="send-btn" onClick={send} aria-label="Send">
        <SendIcon fontSize="small" />
      </button>
    </div>
  );
}
