import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"], // Ensure fallback to polling if WebSocket fails
  withCredentials: true, // Match backend CORS settings
});

export default socket;