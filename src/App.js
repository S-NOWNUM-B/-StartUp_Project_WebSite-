import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import News from './pages/News';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Grades from './pages/Grades';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Router>
    <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/news" element={<News />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </main>
    </div>
      </Router>
    </DataProvider>
  );
}

export default App;
