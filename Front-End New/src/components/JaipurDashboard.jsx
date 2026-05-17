import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================================
// INTEGRATION ENDPOINTS & MOCK DATA
// ============================================================
// Future developers can easily replace these static objects/arrays
// with state from API fetches (e.g., fetch('/api/subject/MA24101')).

const SUBJECT_DETAILS = {
  code: "MA24101",
  name: "MATHEMATICS-1",
  semester: "1st Semester",
  campus: "Jaipur Campus"
};

const MODULES_DATA = [
  { id: 'Module-1', name: 'Module-1', title: 'Calculus, Limits & Continuity' },
  { id: 'Module-2', name: 'Module-2', title: 'Infinite Series & Convergence' },
  { id: 'Module-3', name: 'Module-3', title: 'Matrices & Linear Transformations' },
  { id: 'Module-4', name: 'Module-4', title: 'Multivariable Calculus & Partial Derivatives' }
];

const PRACTICE_MODULES_LIST = [
  { id: 'mod1', name: 'Module 1: Calculus' },
  { id: 'mod2', name: 'Module 2: Infinite Series' },
  { id: 'mod3', name: 'Module 3: Matrices & Linear Algebra' },
  { id: 'mod4', name: 'Module 4: Multivariable Calculus' }
];

const REFERENCE_BOOKS = [
  { id: 'book1', title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', size: '14.2 MB', filesCount: 1 },
  { id: 'book2', title: 'Advanced Engineering Mathematics', author: 'Erwin Kreyszig', size: '28.5 MB', filesCount: 1 }
];

const PREVIOUS_YEAR_PAPERS = [
  { id: 'paper1', year: '2024', term: 'Mid Term', solved: true, filename: 'Math1_Mid_2024_Solved.pdf' },
  { id: 'paper2', year: '2023', term: 'End Term', solved: false, filename: 'Math1_End_2023_Unsolved.pdf' },
  { id: 'paper3', year: '2023', term: 'Mid Term', solved: true, filename: 'Math1_Mid_2023_Solved.pdf' },
  { id: 'paper4', year: '2022', term: 'End Term', solved: true, filename: 'Math1_End_2022_Solved.pdf' }
];

function JaipurDashboard({ theme, onToggleTheme, onBack }) {
  // Page / Content States
  const [activeModule, setActiveModule] = useState('Module-1');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  
  // Practice Mode Dropdowns
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
  const [selectedPracticeModules, setSelectedPracticeModules] = useState(['mod1']);

  // Filters for Previous Year Papers
  const [yearFilter, setYearFilter] = useState('All');
  const [termFilter, setTermFilter] = useState('All'); // 'All', 'Mid Term', 'End Term'
  const [solvedFilter, setSolvedFilter] = useState('All'); // 'All', 'Solved', 'Unsolved'
  
  // Dropdown UI states for filter selectors
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [termDropdownOpen, setTermDropdownOpen] = useState(false);
  const [solvedDropdownOpen, setSolvedDropdownOpen] = useState(false);

  // Active campus selection dropdown state
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  // Interaction feedback states (Toasts/Alerts)
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Practice Selection functions
  const togglePracticeModule = (modId) => {
    setSelectedPracticeModules(prev => 
      prev.includes(modId) 
        ? prev.filter(id => id !== modId) 
        : [...prev, modId]
    );
  };

  const handleStartPractice = () => {
    const activeModuleNames = selectedPracticeModules
      .map(id => PRACTICE_MODULES_LIST.find(m => m.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
    
    if (selectedPracticeModules.length === 0) {
      showToast("Please select at least one module for practice!");
      return;
    }

    showToast(`Starting Practice: Difficulty [${selectedDifficulty}] with [${activeModuleNames}]`);
  };

  // Filter Previous Year Papers
  const filteredPapers = PREVIOUS_YEAR_PAPERS.filter(paper => {
    const matchYear = yearFilter === 'All' || paper.year === yearFilter;
    const matchTerm = termFilter === 'All' || paper.term === termFilter;
    const matchSolved = solvedFilter === 'All' || 
      (solvedFilter === 'Solved' && paper.solved) || 
      (solvedFilter === 'Unsolved' && !paper.solved);
    return matchYear && matchTerm && matchSolved;
  });

  const handleDownloadPaper = (filename) => {
    showToast(`Downloading: ${filename}`);
  };

  const handleDownloadBook = (title) => {
    showToast(`Downloading Materials for: ${title}`);
  };

  const handleResetFilters = () => {
    setYearFilter('All');
    setTermFilter('All');
    setSolvedFilter('All');
    showToast("Filters Reset! Viewing all papers.");
  };

  // Close dropdowns on outside click helper
  const closeAllDropdowns = () => {
    setModulesDropdownOpen(false);
    setDifficultyDropdownOpen(false);
    setYearDropdownOpen(false);
    setTermDropdownOpen(false);
    setSolvedDropdownOpen(false);
    setCampusDropdownOpen(false);
  };

  return (
    <div className="dashboard-container" onClick={closeAllDropdowns} id="dashboard-container">
      {/* Toast popup */}
      <div className={`dashboard-toast ${toastVisible ? 'dashboard-toast--visible' : ''}`} id="dashboard-toast">
        {toastMessage}
      </div>

      {/* ============================================================
          TOP HEADER
          ============================================================ */}
      <header className="dash-header" id="dash-header">
        <div className="dash-header__left">
          <div className="logo-container" onClick={onBack} title="Go back to campus selection">
            <div className="logo-icon-wrapper">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5V15a2 2 0 0 1 2-2h14M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V17" />
                <path d="M6 2v11" />
              </svg>
            </div>
            <span className="logo-text">BitHub</span>
          </div>
        </div>

        <div className="dash-header__right">
          {/* Light/Dark Toggle Switch */}
          <button 
            className="theme-toggle-btn" 
            onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme mode"
            id="theme-toggle-button"
          >
            {theme === 'light' ? (
              // Sun icon (in Light Mode, clicking goes to Dark Mode)
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toggle-icon">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              // Moon icon
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="toggle-icon">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
            <span className="theme-toggle-slider">
              <span className="theme-toggle-knob" />
            </span>
          </button>

          {/* Campus Selector Dropdown */}
          <div className="campus-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className={`campus-select-btn ${campusDropdownOpen ? 'active' : ''}`}
              onClick={() => { closeAllDropdowns(); setCampusDropdownOpen(!campusDropdownOpen); }}
              id="campus-dropdown-trigger"
            >
              <svg className="campus-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>{SUBJECT_DETAILS.campus}</span>
              <svg className="arrow-down-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {campusDropdownOpen && (
              <div className="campus-dropdown-menu" id="campus-dropdown-menu">
                <div className="campus-dropdown-item active">Jaipur Campus (Active)</div>
                <div className="campus-dropdown-item disabled" onClick={() => showToast("Mesra Campus dashboard integration is in planning!")}>
                  Mesra Campus (External link)
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================
          MAIN BODY LAYOUT
          ============================================================ */}
      <div className="dashboard-layout" id="dashboard-layout">
        
        {/* ============================================================
            SIDEBAR (LEFT COLUMN)
            ============================================================ */}
        <aside className="dash-sidebar" id="dash-sidebar">
          {/* Back button */}
          <button className="back-subjects-btn" onClick={onBack} id="back-subjects-button">
            <svg className="btn-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Subjects</span>
          </button>

          {/* Notes Title Header */}
          <div className="sidebar-section-header">
            <svg className="sidebar-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span>NOTES</span>
          </div>

          {/* Modules List */}
          <nav className="modules-nav" id="modules-nav">
            {MODULES_DATA.map(mod => {
              const isSelected = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  className={`module-nav-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setActiveModule(mod.id);
                    showToast(`Switched to Notes: ${mod.name} (${mod.title})`);
                  }}
                  id={`module-btn-${mod.id.toLowerCase()}`}
                >
                  <div className="module-item-left">
                    <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>{mod.name}</span>
                  </div>
                  <svg className="chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              );
            })}
          </nav>

          {/* Divider line before Syllabus */}
          <hr className="sidebar-divider" />

          {/* Syllabus Button */}
          <button 
            className="syllabus-btn" 
            onClick={() => showToast("Syllabus view downloading...")}
            id="syllabus-view-button"
          >
            SYLLABUS
          </button>
        </aside>

        {/* ============================================================
            MAIN CONTENT AREA (RIGHT COLUMN)
            ============================================================ */}
        <main className="dash-main-content" id="dash-main-content">
          
          {/* 1. Subject Header Box */}
          <section className="subject-header-box" id="subject-header-box">
            <div className="subject-meta-left">
              {/* Mathematics root-x square icon */}
              <div className="math-logo-box">
                <svg viewBox="0 0 24 24" className="math-logo-svg">
                  {/* Square Root Symbol Icon */}
                  <path 
                    d="M4 12h2l3 7 5-14h6" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <text x="14" y="16" fontSize="8" fontWeight="bold" fontFamily="sans-serif" fill="currentColor">x</text>
                </svg>
              </div>
              <div className="subject-titles">
                <h2 className="subject-title-name">{SUBJECT_DETAILS.name}</h2>
                <div className="subject-title-sub">
                  <span className="code-badge">{SUBJECT_DETAILS.code}</span>
                  <span className="bullet-separator">•</span>
                  <span className="sem-info">{SUBJECT_DETAILS.semester}</span>
                </div>
              </div>
            </div>

            {/* Stylized vector mountains illustration on the right */}
            <div className="subject-header-hills" aria-hidden="true">
              <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="hills-svg">
                {/* Layered hill vectors echoing the screenshot's warm aesthetic */}
                <path 
                  d="M10 100 C 40 70, 60 50, 90 75 C 110 90, 130 65, 170 100 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.3" 
                />
                <path 
                  d="M40 100 C 70 60, 90 40, 120 70 C 145 90, 160 55, 195 100 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.5" 
                />
                <path 
                  d="M70 100 C 100 50, 125 30, 155 65 C 175 80, 185 70, 200 90" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  opacity="0.8" 
                />
                {/* Dotted accents for artistic depth */}
                <circle cx="125" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
                <circle cx="140" cy="28" r="1" fill="currentColor" opacity="0.4" />
                <circle cx="85" cy="40" r="1.2" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
          </section>

          {/* 2. Grid for Lower Panels */}
          <div className="dashboard-panels-grid">
            
            {/* 2A. Practice Mode Card (Left Panel) */}
            <section className="dashboard-card practice-card" id="practice-card">
              <div className="card-header">
                <div className="card-header-icon-wrapper circle-pink">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div className="card-header-titles">
                  <h3 className="card-title-main">Practice Mode</h3>
                  <p className="card-title-sub">Customize your session.</p>
                </div>
              </div>

              <div className="practice-card-content">
                {/* Select Modules Custom Dropdown */}
                <div className="practice-field-container" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className={`custom-select-trigger ${modulesDropdownOpen ? 'open' : ''}`}
                    onClick={() => { closeAllDropdowns(); setModulesDropdownOpen(!modulesDropdownOpen); }}
                    id="select-modules-dropdown-btn"
                  >
                    <span>Select Modules</span>
                    <svg className="trigger-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  
                  {modulesDropdownOpen && (
                    <div className="custom-dropdown-popover" id="select-modules-popover">
                      <p className="popover-title">Choose Modules to Include:</p>
                      {PRACTICE_MODULES_LIST.map(mod => {
                        const isChecked = selectedPracticeModules.includes(mod.id);
                        return (
                          <label key={mod.id} className="checkbox-label">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => togglePracticeModule(mod.id)}
                            />
                            <span className="checkbox-custom" />
                            <span className="checkbox-text">{mod.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Select Difficulty Dropdown Trigger (syncs with radio buttons below) */}
                <div className="practice-field-container" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className={`custom-select-trigger ${difficultyDropdownOpen ? 'open' : ''}`}
                    onClick={() => { closeAllDropdowns(); setDifficultyDropdownOpen(!difficultyDropdownOpen); }}
                    id="select-difficulty-dropdown-btn"
                  >
                    <span>Select Difficulty: <strong>{selectedDifficulty}</strong></span>
                    <svg className="trigger-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {difficultyDropdownOpen && (
                    <div className="custom-dropdown-popover popover-list" id="select-difficulty-popover">
                      {['Easy', 'Medium', 'Hard'].map(diff => (
                        <div 
                          key={diff} 
                          className={`popover-list-item ${selectedDifficulty === diff ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedDifficulty(diff);
                            setDifficultyDropdownOpen(false);
                            showToast(`Difficulty synced to: ${diff}`);
                          }}
                        >
                          {diff}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Radio Buttons for Difficulty Selector */}
                <div className="difficulty-radio-group" id="difficulty-radio-group">
                  {['Easy', 'Medium', 'Hard'].map(diff => {
                    const isSelected = selectedDifficulty === diff;
                    return (
                      <label 
                        key={diff} 
                        className={`radio-label ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDifficulty(diff)}
                        id={`difficulty-radio-${diff.toLowerCase()}`}
                      >
                        <input 
                          type="radio" 
                          name="difficulty-selection"
                          value={diff}
                          checked={isSelected}
                          onChange={() => setSelectedDifficulty(diff)}
                        />
                        <span className="radio-custom-circle">
                          {isSelected && <span className="radio-custom-circle-inner" />}
                        </span>
                        <span className="radio-label-text">{diff}</span>
                      </label>
                    );
                  })}
                </div>

                {/* START Quiz / Practice Button */}
                <button 
                  className="start-practice-btn" 
                  onClick={handleStartPractice}
                  id="start-practice-button"
                >
                  START
                </button>
              </div>
            </section>

            {/* 2B. Reference Books & Materials + Papers Panel Stack (Right Panel) */}
            <div className="dashboard-right-stack">
              
              {/* Reference Books Card */}
              <section className="dashboard-card light-cream-card reference-card" id="reference-card">
                <div className="card-header">
                  <div className="card-header-icon-wrapper round-maroon">
                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 19.5V15a2 2 0 0 1 2-2h14" />
                      <path d="M20 17v-4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z" />
                      <path d="M12 6V2h8v4" />
                      <path d="M12 2h2" />
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3 className="card-title-main">Reference Books and Materials</h3>
                  </div>
                </div>

                <div className="materials-list-container">
                  {REFERENCE_BOOKS.map(book => (
                    <div 
                      key={book.id} 
                      className="material-file-item" 
                      onClick={() => handleDownloadBook(book.title)}
                      title="Click to access study file"
                    >
                      <div className="file-item-left">
                        <svg className="pdf-doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div className="file-info-text">
                          <span className="file-title">{book.title}</span>
                          <span className="file-author">by {book.author}</span>
                        </div>
                      </div>
                      <span className="file-size-badge">{book.size}</span>
                    </div>
                  ))}
                </div>

                <div className="card-footer-info">
                  <svg className="footer-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>2 Files</span>
                </div>
              </section>

              {/* Previous Year Papers Card */}
              <section className="dashboard-card light-cream-card papers-card" id="papers-card">
                <div className="card-header">
                  <div className="card-header-icon-wrapper round-maroon">
                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3 className="card-title-main">Previous Year Papers</h3>
                  </div>
                </div>

                {/* Filters Section */}
                <div className="papers-filters-wrapper">
                  <span className="filters-label">Filters</span>
                  <div className="filters-row" onClick={(e) => e.stopPropagation()}>
                    
                    {/* 1. Year Filter Trigger */}
                    <div className="filter-dropdown-container">
                      <button 
                        className={`filter-badge-btn ${yearFilter !== 'All' ? 'filtered' : ''}`}
                        onClick={() => { closeAllDropdowns(); setYearDropdownOpen(!yearDropdownOpen); }}
                        id="filter-year-button"
                      >
                        <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>Year {yearFilter !== 'All' ? `: ${yearFilter}` : ''}</span>
                      </button>

                      {yearDropdownOpen && (
                        <div className="filter-popover-menu">
                          {['All', '2024', '2023', '2022'].map(y => (
                            <div 
                              key={y} 
                              className={`filter-popover-item ${yearFilter === y ? 'active' : ''}`}
                              onClick={() => { setYearFilter(y); setYearDropdownOpen(false); }}
                            >
                              {y}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 2. Mid/End Term Filter Trigger */}
                    <div className="filter-dropdown-container">
                      <button 
                        className={`filter-badge-btn ${termFilter !== 'All' ? 'filtered' : ''}`}
                        onClick={() => { closeAllDropdowns(); setTermDropdownOpen(!termDropdownOpen); }}
                        id="filter-term-button"
                      >
                        <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>{termFilter === 'All' ? 'Mid/End Term' : termFilter}</span>
                      </button>

                      {termDropdownOpen && (
                        <div className="filter-popover-menu">
                          {['All', 'Mid Term', 'End Term'].map(t => (
                            <div 
                              key={t} 
                              className={`filter-popover-item ${termFilter === t ? 'active' : ''}`}
                              onClick={() => { setTermFilter(t); setTermDropdownOpen(false); }}
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. Solved Filter Trigger */}
                    <div className="filter-dropdown-container">
                      <button 
                        className={`filter-badge-btn ${solvedFilter !== 'All' ? 'filtered' : ''}`}
                        onClick={() => { closeAllDropdowns(); setSolvedDropdownOpen(!solvedDropdownOpen); }}
                        id="filter-solved-button"
                      >
                        <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{solvedFilter === 'All' ? 'Solved' : solvedFilter}</span>
                      </button>

                      {solvedDropdownOpen && (
                        <div className="filter-popover-menu">
                          {['All', 'Solved', 'Unsolved'].map(s => (
                            <div 
                              key={s} 
                              className={`filter-popover-item ${solvedFilter === s ? 'active' : ''}`}
                              onClick={() => { setSolvedFilter(s); setSolvedDropdownOpen(false); }}
                            >
                              {s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View All Button */}
                    <button 
                      className="view-all-badge-btn" 
                      onClick={handleResetFilters}
                      id="view-all-reset-button"
                    >
                      View All
                    </button>
                  </div>
                </div>

                {/* Filtered Papers List */}
                <div className="papers-list-container" id="papers-list-container">
                  {filteredPapers.length > 0 ? (
                    filteredPapers.map(paper => (
                      <div 
                        key={paper.id} 
                        className="paper-item-row"
                        onClick={() => handleDownloadPaper(paper.filename)}
                        title="Click to download paper PDF"
                      >
                        <div className="paper-info-left">
                          <svg className="pdf-small-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="paper-title-text">
                            Mathematics-1 ({paper.term} {paper.year})
                          </span>
                        </div>
                        <div className="paper-badges-right">
                          <span className={`paper-badge-type ${paper.solved ? 'solved' : 'unsolved'}`}>
                            {paper.solved ? 'Solved' : 'Unsolved'}
                          </span>
                          <span className="paper-download-arrow">↓</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-papers-found">
                      <p>No papers match the selected filters.</p>
                      <button className="reset-filter-link" onClick={handleResetFilters}>
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JaipurDashboard;
