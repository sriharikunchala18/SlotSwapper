import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Notification = ({ user }) => {
  const [incomingSwaps, setIncomingSwaps] = useState([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { socket } = useContext(AuthContext);

  useEffect(() => {
    fetchSwaps();

    if (socket) {
      socket.on('swapAccepted', (data) => {
        setNotifications(prev => [...prev, { type: 'success', message: data.message }]);
        fetchSwaps();
      });

      socket.on('swapRejected', (data) => {
        setNotifications(prev => [...prev, { type: 'error', message: data.message }]);
        fetchSwaps();
      });

      return () => {
        socket.off('swapAccepted');
        socket.off('swapRejected');
      };
    }
  }, [user.id, socket]);

  const fetchSwaps = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/swaps', { headers: { Authorization: token } });
    const swaps = res.data;
    setIncomingSwaps(swaps.filter(swap => swap.requestedEvent.user.toString() === user.id && swap.status === 'PENDING'));
    setOutgoingSwaps(swaps.filter(swap => swap.requester._id === user.id));
  };

  const handleAccept = async (swapId) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/swaps/${swapId}`, { status: 'ACCEPTED' }, { headers: { Authorization: token } });
    fetchSwaps();
  };

  const handleReject = async (swapId) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/swaps/${swapId}`, { status: 'REJECTED' }, { headers: { Authorization: token } });
    fetchSwaps();
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Notifications</h2>

      {/* Real-time notifications */}
      {notifications.map((notif, index) => (
        <div key={index} style={{
          padding: '10px',
          margin: '10px 0',
          borderRadius: '5px',
          backgroundColor: notif.type === 'success' ? '#d4edda' : '#f8d7da',
          color: notif.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${notif.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {notif.message}
          <button onClick={() => removeNotification(index)} style={{ marginLeft: '10px' }}>×</button>
        </div>
      ))}

      <h3>Incoming Requests</h3>
      <ul>
        {incomingSwaps.map(swap => (
          <li key={swap._id}>
            Swap request for {swap.requestedEvent.title} - Offered: {swap.offeredEvent.title}
            <button onClick={() => handleAccept(swap._id)}>Accept</button>
            <button onClick={() => handleReject(swap._id)}>Reject</button>
          </li>
        ))}
      </ul>

      <h3>Outgoing Requests</h3>
      <ul>
        {outgoingSwaps.map(swap => (
          <li key={swap._id}>
            You requested {swap.requestedEvent.title} - Status: {swap.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
