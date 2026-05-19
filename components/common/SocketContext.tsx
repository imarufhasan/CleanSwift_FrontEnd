// src/context/SocketContext.tsx
import { SOCKET_URL } from "@/src/constants/api";
import React, { createContext, useContext, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectSocket: (tokenData: string) => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectSocket: () => {},
  disconnectSocket: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // const connectSocket2 = (tokenData: string) => {
  //   if (!tokenData) {
  //     console.log("❌ No tokenData");
  //     return;
  //   }

  //   // cleanup previous socket
  //   if (socketRef.current) {
  //     socketRef.current.disconnect();
  //     socketRef.current = null;
  //   }

  //   const newSocket = io(SOCKET_URL, {
  //     transports: ["websocket"],
  //     auth: { token: tokenData },
  //   });

  //   newSocket.on("connect", () => {
  //     console.log("✅ Socket connected:", newSocket.id);
  //     setIsConnected(true);
  //     newSocket.emit("authenticate", { token: tokenData });
  //   });
  //   newSocket.on("authenticate", (res: any) => {
  //     console.log("Auth response:", res);
  //   });

  //   newSocket.on("disconnect", () => {
  //     console.log("❌ Socket disconnected");
  //     setIsConnected(false);
  //   });

  //   newSocket.on("error", (err) => {
  //     console.log("🚨 Socket error:", err);
  //     setIsConnected(false);
  //   });

  //   socketRef.current = newSocket;
  //   setSocket(newSocket);
  // };

  const connectSocket = (tokenData: string) => {
    if (!tokenData) return;

    if (socketRef.current?.connected || socketRef.current?.active) {
      console.log("⚡ Socket already active, skipping...");
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: tokenData },
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected 1: ", newSocket.id);
      setIsConnected(true);
      newSocket.emit("authenticate", { token: tokenData });
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.log("🚨 connect_error:", err.message);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
    console.log("🔌 Socket manually disconnected");
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connectSocket, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
