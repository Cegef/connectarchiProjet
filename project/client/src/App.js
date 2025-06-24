import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Navbar from './components/Navbar';
import FreelanceList from './pages/FreelanceList';
import FreelancerProfile from './pages/FreelancerProfile';
import JobPostings from './pages/JobPosting';
import JobDetail from './pages/JobDetail';
import ChatPage from './pages/ChatPage';
import PortfolioItem from './pages/PortfolioItem';
import FreelanceProfileSetup from './pages/FreelanceProfileSetup';
import CompanyProfileSetup from './pages/CompanyProfileSetup';
import UserProfile from './pages/UserProfile';
import ChooseType from './pages/Inscription';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Accueil from './pages/Accueil';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/freelancers" element={<FreelanceList />} />
          <Route path="/freelancer/:id" element={<FreelancerProfile />} />
          <Route path="/jobs" element={<JobPostings />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/inscription" element={<ChooseType />} />
          <Route path="/freelance-setup" element={<FreelanceProfileSetup />} />
          <Route path="/company-setup" element={<CompanyProfileSetup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/portfolio/item/:id" element={<PortfolioItem />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
