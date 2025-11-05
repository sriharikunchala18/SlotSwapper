import React from 'react';
import Calendar from '../components/Calendar';
import Marketplace from '../components/Marketplace';
import Notification from '../components/Notification';

const Home = ({ user }) => {
  return (
    <div>
      <h1>Welcome to SlotSwapper, {user.username}!</h1>
      <Calendar user={user} />
      <Marketplace user={user} />
      <Notification user={user} />
    </div>
  );
};

export default Home;
