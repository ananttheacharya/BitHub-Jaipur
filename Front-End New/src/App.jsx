/**
 * App.jsx — BitHub Landing Page
 *
 * Campus selection screen for the BitHub platform.
 * Displays the BitHub branding with Advercase font and two campus cards:
 *   - Jaipur (coming soon — shows toast on click)
 *   - Mesra (navigates to ../index.html — the main BitHub site)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import CampusCard from './components/CampusCard';
import Toast from './components/Toast';
import JaipurDashboard from './components/JaipurDashboard';

/* Import campus images from the images directory */
import jaipurImg from '../images/jaipur.png';
import mesraImg from '../images/mesra.png';

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'jaipur'
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const timerRef = useRef(null);

  /* Synchronize html theme attribute with React state */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* Toggle Light / Dark Mode */
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  /* Show a toast notification when a disabled campus is clicked */
  const handleDisabledClick = useCallback((campusName) => {
    /* Clear any existing timer to prevent stacking */
    if (timerRef.current) clearTimeout(timerRef.current);

    setToastMessage(`${campusName} campus is coming soon!`);
    setToastVisible(true);

    timerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  }, []);

  /* Cleanup timer on unmount */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Render Jaipur Dashboard if selected
  if (view === 'jaipur') {
    return (
      <JaipurDashboard 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onBack={() => setView('landing')} 
      />
    );
  }

  return (
    <main className="landing-page" id="landing-page">
      {/* BitHub Logo / Title */}
      <h1 className="landing-title" id="bithub-title">
        BitHub
      </h1>

      {/* Subtitle */}
      <p className="landing-subtitle" id="campus-subtitle">
        Select your campus
      </p>

      {/* Campus Cards */}
      <div className="campus-grid" id="campus-grid">
        <CampusCard
          name="JAIPUR"
          image={jaipurImg}
          href="#"
          disabled={false}
          onClick={() => setView('jaipur')}
        />
        <CampusCard
          name="MESRA"
          image={mesraImg}
          href="../index.html"
          disabled={false}
        />
      </div>

      {/* Toast Notification */}
      <Toast message={toastMessage} visible={toastVisible} />

      {/* Footer */}
      <footer className="landing-footer" id="landing-footer">
        © 2025–2026 Birla Institute of Technology | Team BitHub
      </footer>
    </main>
  );
}

export default App;
