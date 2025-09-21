import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Messages.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SendIcon from "@mui/icons-material/Send";
import { mockConversations } from "./MockConversations";

export default function Messages() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(mockConversations[0]?.id || null);
  const [convos, setConvos] = useState(mockConversations);

  const active = useMemo(
    () => convos.find((c) => c.id === activeId) || null,
    [convos, activeId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return convos;
    return convos.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [convos, query]);

  const handleSend = (text) => {
    if (!text.trim() || !active) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id !== active.id
          ? c
          : {
              ...c,
              unread: 0,
              lastAt: "now",
              messages: [
                ...c.messages,
                {
                  id: `m${Date.now()}`,
                  author: "You",
                  text: text.trim(),
                  at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  me: true,
                },
              ],
            }
      )
    );
  };

  return (
    <div className="msgs">
      <aside className="msgs__list">
        <div className="msgs__convos">
          {filtered.map((c) => (
            <button
              key={c.id}
              className={`convo ${c.id === activeId ? "is-active" : ""}`}
              onClick={() => setActiveId(c.id)}
              aria-current={c.id === activeId ? "page" : undefined}
            >
              <img className="convo__avatar" src={c.avatar} alt={`${c.name} avatar`} />
              <div className="convo__main">
                <div className="convo__row">
                  <span className="convo__name">{c.name}</span>
                  <span className="convo__time">{c.lastAt}</span>
                </div>
                <div className="convo__row">
                  <span className="convo__preview">
                    {c.messages[c.messages.length - 1]?.text ?? "No messages yet"}
                  </span>
                  {c.unread > 0 && <span className="convo__badge">{c.unread}</span>}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="msgs__empty">No conversations match “{query}”.</div>
          )}
        </div>
      </aside>
      <section className="msgs__thread">
        {active ? (
          <>
            <ThreadHeader name={active.name} avatar={active.avatar} />
            <ThreadMessages messages={active.messages} />
            <ThreadComposer onSend={handleSend} />
          </>
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
