import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marketplace = ({ user }) => {
  const [availableEvents, setAvailableEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchAvailableEvents();
    fetchUserEvents();
  }, []);

  const fetchAvailableEvents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/events/available', { headers: { Authorization: token } });
    setAvailableEvents(res.data);
  };

  const fetchUserEvents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/events', { headers: { Authorization: token } });
    setUserEvents(res.data.filter(event => event.status === 'SWAPPABLE'));
  };

  const handleSwapRequest = (eventId) => {
    setSelectedEvent(eventId);
    setShowModal(true);
  };

  const submitSwapRequest = async (mySlotId) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/swaps', { requestedEventId: selectedEvent, offeredEventId: mySlotId }, { headers: { Authorization: token } });
    alert('Swap request sent!');
    setShowModal(false);
    fetchAvailableEvents();
    fetchUserEvents();
  };

  return (
    <div>
      <h2>Marketplace</h2>
      <ul>
        {availableEvents.map(event => (
          <li key={event._id}>
            {event.title} - {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
            <button onClick={() => handleSwapRequest(event._id)}>Request Swap</button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <h3>Select your event to offer in exchange:</h3>
            <ul>
              {userEvents.map(event => (
                <li key={event._id}>
                  {event.title} - {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
                  <button onClick={() => submitSwapRequest(event._id)}>Offer This</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
