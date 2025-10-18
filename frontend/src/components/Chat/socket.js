import { io } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  if (socket) return socket;
  // Prefer same-origin (will be proxied by Vite when running dev). If you
  // need to connect directly to backend, set VITE_API_ORIGIN in .env.
  const origin = import.meta.env.VITE_API_ORIGIN || '/';
  socket = io(origin, {
    path: '/socket.io',
    auth: { token }
  });
  return socket;
}

export function getSocket() {
  return socket;
}
