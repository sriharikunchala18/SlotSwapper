import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <nav>
          {!user ? (
            <>
              <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link> | <Link to="/profile">Profile</Link> | <button onClick={logout}>Logout</button>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
