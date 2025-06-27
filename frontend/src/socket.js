import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  transports: ["websocket", "polling"], // fallback to polling
  withCredentials: true, // match backend CORS settings
});

export default socket;
