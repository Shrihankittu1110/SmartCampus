import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SocketProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </SocketProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
