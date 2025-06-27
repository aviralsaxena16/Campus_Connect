import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_BASE_URL, {
  transports: ["websocket", "polling"], // Ensure fallback to polling if WebSocket fails
  withCredentials: true, // Match backend CORS settings
});

export default socket;