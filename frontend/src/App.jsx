import React from 'react';
     import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
     import LandingPage from './pages/LandingPage';
     import LoginPage from './pages/LoginPage';
     import RegisterPage from './pages/RegisterPage';
     import DashboardPage from './pages/DashboardPage';
     import CreateProjectPage from './pages/CreateProjectPage';

     function App() {
       return (
         <Router>
           <Routes>
             <Route path="/" element={<LandingPage />} />
             <Route path="/login" element={<LoginPage />} />
             <Route path="/register" element={<RegisterPage />} />
             <Route path="/dashboard" element={<DashboardPage />} />
             <Route path="/create-project" element={<CreateProjectPage />} />
           </Routes>
         </Router>
       );
     }

     export default App;