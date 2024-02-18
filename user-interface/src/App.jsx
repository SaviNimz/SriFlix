import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sriflix from './pages/Sriflix';
import Player from './pages/Player';
import Movies from './pages/Movies';

const App = () => {
  return (
    
    <Router>

      <Routes>

        <Route path="/" element={<Sriflix/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/player" element={<Player />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </Router>
  );
};

export default App;