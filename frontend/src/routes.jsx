import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjetCreatePage from './pages/ProjetCreatePage';
import ProjetEditPage from './pages/ProjetEditPage';
import ClientViewPage from './pages/ClientViewPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projet/create" element={<ProjetCreatePage />} />
        <Route path="/projet/edit" element={<ProjetEditPage />} />
        <Route path="/client/view" element={<ClientViewPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;