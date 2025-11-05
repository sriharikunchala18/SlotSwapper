import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUser(decoded);

        // Connect to socket
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('join', decoded.id);

        return () => {
          newSocket.disconnect();
        };
      }
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData.user);

    // Connect to socket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    newSocket.emit('join', userData.user.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
