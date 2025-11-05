import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', startTime: '', endTime: '', status: 'BUSY' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/events', { headers: { Authorization: token } });
    setEvents(res.data);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const eventData = {
      ...newEvent,
      startTime: newEvent.startTime + ':00',
      endTime: newEvent.endTime + ':00',
    };
    await axios.post('http://localhost:5000/api/events', eventData, { headers: { Authorization: token } });
    fetchEvents();
    setNewEvent({ title: '', description: '', startTime: '', endTime: '', status: 'BUSY' });
  };

  return (
    <div>
      <h2>My Calendar</h2>
      <form onSubmit={handleCreateEvent}>
        <input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} required />
        <input placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        <input type="datetime-local" value={newEvent.startTime} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} required />
        <input type="datetime-local" value={newEvent.endTime} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} required />
        <label>
          <input type="checkbox" checked={newEvent.status === 'SWAPPABLE'} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.checked ? 'SWAPPABLE' : 'BUSY' })} />
          Available for swap
        </label>
        <button type="submit">Add Event</button>
      </form>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            {event.title} - {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
            {event.status === 'SWAPPABLE' && <span> (Swappable)</span>}
            {event.status === 'SWAP_PENDING' && <span> (Pending Swap)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;
