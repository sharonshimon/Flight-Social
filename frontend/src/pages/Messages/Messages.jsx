import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Messages.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SendIcon from "@mui/icons-material/Send";

export const mockConversations = [
  {
    id: "c1",
    name: "Flight Buddies",
    avatar: "https://i.pravatar.cc/80?img=11",
    unread: 2,
    lastAt: "09:42",
    messages: [
      { id: "m1", author: "Mia", text: "Wheels up at 7?", at: "09:10", me: false },
      { id: "m2", author: "You", text: "7 works ✈️", at: "09:12", me: true },
      { id: "m3", author: "Alex", text: "Meet at Gate C4", at: "09:40", me: false },
      { id: "m4", author: "You", text: "On my way", at: "09:41", me: true },
    ],
  },
  {
    id: "c2",
    name: "Ariel P.",
    avatar: "https://i.pravatar.cc/80?img=32",
    unread: 0,
    lastAt: "Yesterday",
    messages: [
      { id: "m1", author: "Ariel", text: "Send me your route?", at: "18:22", me: false },
      { id: "m2", author: "You", text: "Dropping it here now.", at: "18:25", me: true },
      { id: "m3", author: "Ariel", text: "Got it, thanks!", at: "18:27", me: false },
    ],
  },
  {
    id: "c3",
    name: "Ground Crew",
    avatar: "https://i.pravatar.cc/80?img=5",
    unread: 0,
    lastAt: "Mon",
    messages: [
      { id: "m1", author: "Dana", text: "Checklist updated.", at: "12:01", me: false },
      { id: "m2", author: "You", text: "Reviewing now.", at: "12:05", me: true },
    ],
  },
  {
    id: "c4",
    name: "Ops Control",
    avatar: "https://i.pravatar.cc/80?img=7",
    unread: 1,
    lastAt: "08:03",
    messages: [
      { id: "m1", author: "Ops", text: "Runway 12 closed 10–12.", at: "07:50", me: false },
      { id: "m2", author: "You", text: "Copy that.", at: "07:53", me: true },
      { id: "m3", author: "Ops", text: "Use 30L for departure.", at: "08:03", me: false },
    ],
  },
  {
    id: "c5",
    name: "Dispatch",
    avatar: "https://i.pravatar.cc/80?img=8",
    unread: 0,
    lastAt: "Tue",
    messages: [
      { id: "m1", author: "Dispatch", text: "Fuel uplift confirmed.", at: "14:20", me: false },
      { id: "m2", author: "You", text: "Roger.", at: "14:22", me: true },
    ],
  },
  {
    id: "c6",
    name: "Maya L.",
    avatar: "https://i.pravatar.cc/80?img=12",
    unread: 3,
    lastAt: "10:15",
    messages: [
      { id: "m1", author: "Maya", text: "Photos from Chiang Mai 😊", at: "10:05", me: false },
      { id: "m2", author: "Maya", text: "Sending now…", at: "10:07", me: false },
      { id: "m3", author: "Maya", text: "Did you get them?", at: "10:15", me: false },
    ],
  },
  {
    id: "c7",
    name: "Aviation Club TLV",
    avatar: "https://i.pravatar.cc/80?img=15",
    unread: 0,
    lastAt: "Fri",
    messages: [
      { id: "m1", author: "Ron", text: "Meetup moved to 19:00.", at: "16:03", me: false },
      { id: "m2", author: "You", text: "See you there.", at: "16:05", me: true },
    ],
  },
  {
    id: "c8",
    name: "Gear Swap",
    avatar: "https://i.pravatar.cc/80?img=16",
    unread: 1,
    lastAt: "11:47",
    messages: [
      { id: "m1", author: "Eli", text: "Selling a barely used headset.", at: "11:02", me: false },
      { id: "m2", author: "You", text: "Price?", at: "11:10", me: true },
      { id: "m3", author: "Eli", text: "$180, pickup in Herzliya.", at: "11:47", me: false },
    ],
  },
  {
    id: "c9",
    name: "Family",
    avatar: "https://i.pravatar.cc/80?img=17",
    unread: 0,
    lastAt: "Sun",
    messages: [
      { id: "m1", author: "Mom", text: "Fly safe! ❤️", at: "08:30", me: false },
      { id: "m2", author: "You", text: "Love you!", at: "08:32", me: true },
    ],
  },
  {
    id: "c10",
    name: "Engineers",
    avatar: "https://i.pravatar.cc/80?img=18",
    unread: 5,
    lastAt: "09:58",
    messages: [
      { id: "m1", author: "Gal", text: "Maintenance window today.", at: "09:10", me: false },
      { id: "m2", author: "You", text: "What time?", at: "09:12", me: true },
      { id: "m3", author: "Gal", text: "13:00–15:00 UTC.", at: "09:20", me: false },
      { id: "m4", author: "Tamar", text: "Deploying new firmware.", at: "09:45", me: false },
      { id: "m5", author: "Gal", text: "Ping if issues.", at: "09:58", me: false },
    ],
  },
  {
    id: "c11",
    name: "Charter Clients",
    avatar: "https://i.pravatar.cc/80?img=20",
    unread: 0,
    lastAt: "Thu",
    messages: [
      { id: "m1", author: "Sara", text: "Invoice received, thanks.", at: "17:31", me: false },
      { id: "m2", author: "You", text: "Pleasure!", at: "17:33", me: true },
    ],
  },
  {
    id: "c12",
    name: "Weather Watch",
    avatar: "https://i.pravatar.cc/80?img=21",
    unread: 1,
    lastAt: "07:22",
    messages: [
      { id: "m1", author: "WX Bot", text: "Strong crosswinds expected 16–20kt.", at: "07:22", me: false },
    ],
  },
  {
    id: "c13",
    name: "Tower",
    avatar: "https://i.pravatar.cc/80?img=22",
    unread: 0,
    lastAt: "Today",
    messages: [
      { id: "m1", author: "ATC", text: "Cleared to taxi, hold short of RWY 30.", at: "06:44", me: false },
      { id: "m2", author: "You", text: "Holding short 30.", at: "06:45", me: true },
    ],
  },
  {
    id: "c14",
    name: "Rina S.",
    avatar: "https://i.pravatar.cc/80?img=23",
    unread: 0,
    lastAt: "Yesterday",
    messages: [
      { id: "m1", author: "Rina", text: "Café later?", at: "19:11", me: false },
      { id: "m2", author: "You", text: "Down for 18:30.", at: "19:12", me: true },
      { id: "m3", author: "Rina", text: "Perfect ☕️", at: "19:13", me: false },
    ],
  },
  {
    id: "c15",
    name: "Run Club",
    avatar: "https://i.pravatar.cc/80?img=24",
    unread: 0,
    lastAt: "Wed",
    messages: [
      { id: "m1", author: "Noam", text: "5k loop at park?", at: "20:05", me: false },
      { id: "m2", author: "You", text: "Count me in.", at: "20:07", me: true },
    ],
  },
  {
    id: "c16",
    name: "Spare Parts",
    avatar: "https://i.pravatar.cc/80?img=25",
    unread: 2,
    lastAt: "11:03",
    messages: [
      { id: "m1", author: "Ori", text: "Ordered brake pads.", at: "10:51", me: false },
      { id: "m2", author: "You", text: "ETA?", at: "10:55", me: true },
      { id: "m3", author: "Ori", text: "Tomorrow morning.", at: "11:03", me: false },
    ],
  },
  {
    id: "c17",
    name: "Pilots Lounge",
    avatar: "https://i.pravatar.cc/80?img=26",
    unread: 0,
    lastAt: "Sat",
    messages: [
      { id: "m1", author: "Lee", text: "Anyone flying Eilat next week?", at: "13:10", me: false },
      { id: "m2", author: "You", text: "Possibly Thursday.", at: "13:22", me: true },
    ],
  },
  {
    id: "c18",
    name: "Nadav K.",
    avatar: "https://i.pravatar.cc/80?img=27",
    unread: 1,
    lastAt: "08:59",
    messages: [
      { id: "m1", author: "Nadav", text: "Share your flight plan file?", at: "08:59", me: false },
    ],
  },
  {
    id: "c19",
    name: "Catering",
    avatar: "https://i.pravatar.cc/80?img=28",
    unread: 0,
    lastAt: "Tue",
    messages: [
      { id: "m1", author: "Chef", text: "Vegetarian options confirmed.", at: "15:40", me: false },
      { id: "m2", author: "You", text: "Great, thanks!", at: "15:42", me: true },
    ],
  },
  {
    id: "c20",
    name: "Heli Ops",
    avatar: "https://i.pravatar.cc/80?img=29",
    unread: 4,
    lastAt: "10:48",
    messages: [
      { id: "m1", author: "Ziv", text: "Rotor check scheduled.", at: "10:12", me: false },
      { id: "m2", author: "You", text: "Acknowledged.", at: "10:20", me: true },
      { id: "m3", author: "Ziv", text: "Weather marginal VFR.", at: "10:35", me: false },
      { id: "m4", author: "You", text: "We’ll monitor.", at: "10:48", me: true },
    ],
  },
];


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
      {/* room for actions: call, video, info */}
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
