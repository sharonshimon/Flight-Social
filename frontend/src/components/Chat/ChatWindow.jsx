import React, { useEffect, useState, useRef } from 'react';
import { connectSocket } from './socket';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import "./ChatWindow.css";


export default function ChatWindow({ currentUser, peerId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    socketRef.current = connectSocket(token);

    socketRef.current.on('connect_error', (err) => console.error('Socket error', err));

    socketRef.current.on('private_message', (msg) => {
      setMessages((m) => [...m, msg]);
    });

    return () => {
      const s = socketRef.current;
      if (s) s.off('private_message');
    };
  }, []);

  // fetch history when peerId changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!peerId) return;
      try {
        const token = localStorage.getItem('token');
        const me = JSON.parse(localStorage.getItem('user') || 'null');
        const myId = me?._id || me?.id || me?.userId;
        const endpoint = (API_ENDPOINTS.chat?.messages || '/api/v1/chat/messages/:userId/:peerId')
          .replace(':userId', myId)
          .replace(':peerId', peerId);
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to load conversation');
        const body = await res.json();
        setMessages(body.data || []);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchHistory();
  }, [peerId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = { to: peerId, content: text, toName: '' };
    const s = socketRef.current;
    if (s && s.connected) {
      s.emit('private_message', payload);
      setText('');
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m) => (
          <div key={m._id || m.createdAt} className={m.senderId === currentUser.id ? 'msg sent' : 'msg'}>
            <div className="content">{m.content}</div>
            <div className="time">{new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="composer">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
