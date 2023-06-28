import React from 'react';
import './App.css';
import ServerList from './components/ServerList';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServerDetail from './components/ServerDetail';

function App() {
  return (
    
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ServerList />} />
          <Route path="/server/:id" element={<ServerDetail />} />
        </Routes>
      </Router>
    
  );
}

export default App;
