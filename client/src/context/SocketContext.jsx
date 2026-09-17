import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if user is authenticated
    const token = localStorage.getItem('cf_access_token');
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Connect to WebSocket server (using Vite proxy in dev or current origin in prod)
    const socketServerUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : window.location.origin;

    const socket = io(socketServerUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('CONNECTED', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    // Real-time Push Notification handler
    socket.on('NOTIFICATION', (notif) => {
      if (!notif) return;
      const toastType = notif.type === 'ANNOUNCEMENT' ? 'info' : 'success';
      showToast(notif.message, toastType, notif.title || 'CampusFlow Notification');

      // Dispatch custom browser event for NotificationContext to catch instantly
      window.dispatchEvent(new CustomEvent('campusflow:new_notification', { detail: notif }));
    });

    // Real-time Academic & Placement Events
    socket.on('ATTENDANCE_RECORDED', (data) => {
      showToast(data.message || 'Attendance records updated.', 'info', 'Attendance Update');
    });

    socket.on('ASSIGNMENT_GRADED', (data) => {
      showToast(data.message || 'An assignment grade has been published.', 'success', 'Grade Published');
    });

    socket.on('PLACEMENT_STATUS_UPDATED', (data) => {
      showToast(data.message || 'Your placement drive status has been updated.', 'success', 'Placement Update');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user, showToast]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
