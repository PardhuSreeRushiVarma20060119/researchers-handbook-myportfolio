import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Analytics } from '@vercel/analytics/react';

import LabBackground from './components/LabBackground';
import JournalLayout from './components/JournalLayout';
import AdminBar from './components/AdminBar';
import LoginPage from './components/LoginPage';
import BlogReader from './components/BlogReader';

// Import fonts
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';

import './index.css';

// Main Content Wrapper to consume Context
const MainLayout = () => {
  const { settings } = useData();

  // Apply Accent Color & Reading Mode on Mount/Change
  React.useEffect(() => {
    if (settings?.accentColor) {
      document.documentElement.style.setProperty('--accent-cyber', settings.accentColor);
    }
    // Reading Mode Class
    if (settings?.readingMode) {
      document.body.classList.add('reading-mode');
    } else {
      document.body.classList.remove('reading-mode');
    }

    // Update Document Title
    if (settings?.siteTitle) {
      document.title = settings.siteTitle;
    }
  }, [settings]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blog/:id" element={<BlogReader />} />
        <Route path="/" element={
          <>
            {settings?.enableAnimations && !settings?.readingMode && <LabBackground />}
            <JournalLayout />
            <AdminBar />
          </>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
        <Analytics />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
