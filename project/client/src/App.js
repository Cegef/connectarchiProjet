import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import Navbar from './components/Navbar';
import Tarification from './pages/Tarification';
import Success from './pages/Success';
import FreelanceList from './pages/FreelanceList';
import FreelancerProfile from './pages/FreelancerProfile';
import JobSeekerProfile from './pages/JobSeekerProfile';
import JobPostings from './pages/JobPosting';
import JobDetail from './pages/JobDetail';
import ChatPage from './pages/ChatPage';
import PortfolioItem from './pages/PortfolioItem';
import FreelanceProfileSetup from './pages/FreelanceProfileSetup';
import CompanyProfileSetup from './pages/CompanyProfileSetup';
import JobSeekerProfileSetup from './pages/JobSeekerProfileSetup';
import UserProfile from './pages/UserProfile';
import ChooseType from './pages/Inscription';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Accueil from './pages/Accueil';
import Footer from './components/Footer';
import Contact from "./pages/Contact";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/freelancers" element={<FreelanceList />} />
          <Route path="/freelancer/:id" element={<FreelancerProfile />} />
          <Route path="/jobseeker/:id" element={<JobSeekerProfile />} />
          <Route path="/jobs" element={<JobPostings />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/tarification" element={<Tarification />} />
          <Route path="/success" element={<Success />} />
          <Route path="/inscription" element={<ChooseType />} />
          <Route path="/freelance-setup" element={<FreelanceProfileSetup />} />
          <Route path="/company-setup" element={<CompanyProfileSetup />} />
          <Route path="/jobseeker-setup" element={<JobSeekerProfileSetup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/portfolio/item/:id" element={<PortfolioItem />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
