import React from 'react';
import './App.css';
import ServerList from './components/serverList/ServerList';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServerDetail from './components/serverDetail/ServerDetail';

function App() {
  return (
    
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ServerList />} />
          <Route path="/server/:id" element={<ServerDetail />} />
          <Route path="/server" element={<ServerDetail />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    
  );
}

export default App;
