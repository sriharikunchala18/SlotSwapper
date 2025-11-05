import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = ({ user }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
