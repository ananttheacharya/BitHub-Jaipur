import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Sub-parser to split text by $ and $$ delimiters
const parseInlineDollars = (str) => {
  if (!str) return [];
  
  const parts = [];
  const doubleDollarParts = str.split('$$');
  
  doubleDollarParts.forEach((ddPart, ddIndex) => {
    if (ddIndex % 2 === 1) {
      parts.push({ isMath: true, isBlock: true, content: ddPart });
    } else {
      const singleDollarParts = ddPart.split('$');
      singleDollarParts.forEach((sdPart, sdIndex) => {
        if (sdIndex % 2 === 1) {
          parts.push({ isMath: true, isBlock: false, content: sdPart });
        } else {
          if (sdPart) {
            parts.push({ isMath: false, content: sdPart });
          }
        }
      });
    }
  });
  
  return parts;
};

// Robust mixed LaTeX and plain text parser (extracts \text{} and inline $)
const parseMixedLatex = (str) => {
  if (!str) return [];
  
  // Normalize double backslashes
  let cleaned = str.trim();
  cleaned = cleaned.replace(/\\\\\\\\/g, '\\\\');
  cleaned = cleaned.replace(/\\\\newline/g, '\\\\');
  cleaned = cleaned.replace(/\\\\/g, '\\');
  
  const result = [];
  let index = 0;
  
  while (index < cleaned.length) {
    const textStart = cleaned.indexOf('\\text{', index);
    
    if (textStart === -1) {
      const remaining = cleaned.substring(index);
      if (remaining) {
        const subParts = parseInlineDollars(remaining);
        result.push(...subParts);
      }
      break;
    }
    
    if (textStart > index) {
      const beforeText = cleaned.substring(index, textStart);
      const subParts = parseInlineDollars(beforeText);
      result.push(...subParts);
    }
    
    // Find matching closing bracket for \text{
    let bracketCount = 1;
    let scanIndex = textStart + 6;
    while (scanIndex < cleaned.length && bracketCount > 0) {
      if (cleaned[scanIndex] === '{') bracketCount++;
      else if (cleaned[scanIndex] === '}') bracketCount--;
      scanIndex++;
    }
    
    const textContent = cleaned.substring(textStart + 6, scanIndex - 1);
    result.push({ isMath: false, content: textContent });
    
    index = scanIndex;
  }
  
  return result;
};

// Robust and premium mixed LaTeX/Text renderer with auto-wrap
const renderLatex = (textVal) => {
  if (textVal === undefined || textVal === null) return null;
  let text = String(textVal).trim();

  // If it already contains explicit delimiters, parse as is
  if (text.includes('$')) {
    const hasBlockEnvironment = /\\begin\{array\}|\\begin\{matrix\}|\\begin\{enumerate\}|\\begin\{align\}/.test(text);
    if (hasBlockEnvironment) {
      let cleaned = text.replace(/\\\\\\\\/g, '\\\\').replace(/\\\\newline/g, '\\\\');
      cleaned = cleaned.replace(/\\\\/g, '\\');
      return (
        <div className="katex-block-wrapper" style={{ overflowX: 'auto', maxWidth: '100%', whiteSpace: 'normal' }}>
          <BlockMath math={cleaned} />
        </div>
      );
    }
    return parseMixedLatex(text).map((part, idx) => {
      if (part.isMath) {
        return part.isBlock ? (
          <BlockMath key={idx} math={part.content} />
        ) : (
          <InlineMath key={idx} math={part.content} />
        );
      }
      return <span key={idx}>{part.content}</span>;
    });
  }

  // Smart LaTeX auto-wrapper: wrap ONLY mathematical expressions in '$' delimiters
  if (text.includes('\\') || text.includes('_') || text.includes('^')) {
    const tokens = text.split(/(\s+)/);
    const processed = tokens.map(token => {
      if (/^\s+$/.test(token)) return token;
      if (token.includes('\\text{')) return token;

      const hasMathIndicator = token.includes('\\') || token.includes('^') || token.includes('_') || token.includes('=') || token.includes('<') || token.includes('>');
      
      if (hasMathIndicator) {
        // Strip LaTeX command names and check if it contains actual plain English words of length 3 or more
        const cleanToken = token.replace(/\\[a-zA-Z]+/g, '').replace(/text/g, '');
        const hasWord = /[a-zA-Z]{3,}/.test(cleanToken);
        if (!hasWord) {
          return `$${token}$`;
        }
      }
      return token;
    });

    text = processed.join('');
  }

  const hasBlockEnvironment = /\\begin\{array\}|\\begin\{matrix\}|\\begin\{enumerate\}|\\begin\{align\}/.test(text);

  if (hasBlockEnvironment) {
    let cleaned = text.replace(/\\\\\\\\/g, '\\\\').replace(/\\\\newline/g, '\\\\');
    cleaned = cleaned.replace(/\\\\/g, '\\');
    return (
      <div className="katex-block-wrapper" style={{ overflowX: 'auto', maxWidth: '100%', whiteSpace: 'normal' }}>
        <BlockMath math={cleaned} />
      </div>
    );
  }

  const parts = parseMixedLatex(text);
  
  if (parts.length === 0) {
    return <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{text}</span>;
  }

  return (
    <div className="katex-line-block" style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.6' }}>
      {parts.map((part, index) => {
        if (part.isMath) {
          if (part.isBlock) {
            return (
              <div className="katex-block-wrapper" key={index} style={{ overflowX: 'auto', maxWidth: '100%', margin: '0.5rem 0' }}>
                <BlockMath math={part.content.trim()} />
              </div>
            );
          }
          return <InlineMath key={index} math={part.content.trim()} />;
        }
        return <span key={index}>{part.content}</span>;
      })}
    </div>
  );
};

// Check if expected answer is simple/numerical
const isSimpleAnswer = (ans) => {
  if (ans === undefined || ans === null) return true;
  const cleanAns = String(ans).trim();
  const hasLaTeX = /\\|\^|_|\{|\}/.test(cleanAns);
  const isShort = cleanAns.length < 15;
  const isNumericExpression = /^[+-]?\d+(\.\d+)?(\/\d+)?$/.test(cleanAns);
  
  return (!hasLaTeX && (isShort || isNumericExpression));
};

// Seeded deterministic MCQ choices generator
const generateDistractors = (correctAnswerVal, questionUid) => {
  if (correctAnswerVal === undefined || correctAnswerVal === null) return [];
  const correctAnswer = String(correctAnswerVal);
  
  let seed = 0;
  if (questionUid) {
    for (let i = 0; i < questionUid.length; i++) {
      seed += questionUid.charCodeAt(i);
    }
  }
  
  const pseudoRandom = (offset) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const distractors = [];
  
  // Pattern 1: Fractions, e.g. \frac{a}{b}
  if (correctAnswer.includes('\\frac')) {
    for (let i = 1; i <= 3; i++) {
      let opt = correctAnswer;
      opt = opt.replace(/(\d+)/g, (match) => {
        const val = parseInt(match);
        const change = Math.floor(pseudoRandom(i + val) * 4) + 1;
        return String(pseudoRandom(i) > 0.5 ? val + change : Math.max(1, val - change));
      });
      if (pseudoRandom(i + 10) > 0.5) {
        opt = opt.replace(/\+/g, 'TEMP_MINUS').replace(/-/g, '+').replace(/TEMP_MINUS/g, '-');
      }
      if (opt !== correctAnswer && !distractors.includes(opt)) {
        distractors.push(opt);
      }
    }
  }
  
  // Pattern 2: Differential Equations (having c_1, c_2, x^r)
  if (correctAnswer.includes('c_1') || correctAnswer.includes('c_2') || correctAnswer.includes('^')) {
    const powerRegex = /\^\{?(-?\d+\/?\d*)\}?/g;
    for (let i = 1; i <= 3; i++) {
      let opt = correctAnswer;
      opt = opt.replace(powerRegex, (match, p1) => {
        if (p1.includes('/')) {
          const [num, den] = p1.split('/').map(Number);
          const newNum = pseudoRandom(i) > 0.5 ? num + 2 : Math.max(1, num - 2);
          return `^{${newNum}/${den}}`;
        } else {
          const val = parseInt(p1);
          const newVal = pseudoRandom(i) > 0.5 ? val + 1 : val - 1;
          return `^{${newVal}}`;
        }
      });
      if (pseudoRandom(i + 20) > 0.5) {
        opt = opt.replace(/c_1/g, 'TEMP_C').replace(/c_2/g, 'c_1').replace(/TEMP_C/g, 'c_2');
      }
      if (opt !== correctAnswer && !distractors.includes(opt)) {
        distractors.push(opt);
      }
    }
  }

  // Backup rules
  let attempts = 0;
  while (distractors.length < 3 && attempts < 15) {
    attempts++;
    let opt = correctAnswer;
    
    opt = opt.replace(/(\d+)/g, (match) => {
      const val = parseInt(match);
      const delta = Math.floor(pseudoRandom(attempts + val) * 3) + 1;
      return String(pseudoRandom(attempts) > 0.5 ? val + delta : Math.max(0, val - delta));
    });
    
    if (pseudoRandom(attempts + 30) > 0.5) {
      opt = opt.replace(/\+/g, 'TEMP_MINUS').replace(/-/g, '+').replace(/TEMP_MINUS/g, '-');
    }
    
    if (opt !== correctAnswer && !distractors.includes(opt)) {
      distractors.push(opt);
    }
  }
  
  while (distractors.length < 3) {
    const i = distractors.length;
    distractors.push(`${correctAnswer} + ${i + 1}`);
  }
  
  const allChoices = [correctAnswer, ...distractors];
  const shuffledChoices = [];
  const choiceIndices = [0, 1, 2, 3];
  
  for (let i = 3; i >= 0; i--) {
    const r = Math.floor(pseudoRandom(i) * (i + 1));
    const targetIdx = choiceIndices.splice(r, 1)[0];
    shuffledChoices.push(allChoices[targetIdx]);
  }
  
  return shuffledChoices;
};

function PracticeMode({ subjectCode, selectedModules, difficulties = ['Easy', 'Medium', 'Hard'], marks = [2, 3, 5], years = ['2022', '2023', '2024'], onBack, theme, onToggleTheme }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Active question index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-question interactive states
  const [userAnswers, setUserAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [statuses, setStatuses] = useState({}); // 'correct', 'incorrect', 'unattempted'
  const [solutions, setSolutions] = useState({});
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [showSolutionPanel, setShowSolutionPanel] = useState({});

  const currentQ = questions[currentIndex];
  const isMcq = currentQ && !isSimpleAnswer(currentQ.final_answer);
  const isNumerical = currentQ && isSimpleAnswer(currentQ.final_answer);

  const mcqChoices = React.useMemo(() => {
    if (!currentQ || !isMcq) return [];
    return generateDistractors(currentQ.final_answer, currentQ.uid);
  }, [currentQ, isMcq]);

  useEffect(() => {
    // Fetch questions for all selected modules
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        let allQs = [];
        const diffsStr = difficulties.join(',').toLowerCase();
        const yearsStr = years.join(',');
        const marksStr = marks.join(',');
        
        for (const mod of selectedModules) {
          const modNumber = mod.replace('mod', '');
          const res = await fetch(`http://localhost:3001/api/practice/questions?subject=${subjectCode}&module=${modNumber}&difficulty=${diffsStr}&year=${yearsStr}&marks=${marksStr}`);
          const data = await res.json();
          if (data.questions) {
            allQs = [...allQs, ...data.questions];
          }
        }
        setQuestions(allQs);
        
        // Initialize status grid
        const initStatuses = {};
        allQs.forEach((_, idx) => {
          initStatuses[idx] = 'unattempted';
        });
        setStatuses(initStatuses);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [subjectCode, selectedModules, difficulties, years, marks]);

  // Statistics calculation
  const totalQuestions = questions.length;
  const attemptedCount = Object.values(statuses).filter(s => s !== 'unattempted').length;
  const correctCount = Object.values(statuses).filter(s => s === 'correct').length;
  const incorrectCount = Object.values(statuses).filter(s => s === 'incorrect').length;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  if (loading) {
    return (
      <div className="practice-loader-container">
        <div className="practice-spinner"></div>
        <span className="spin-loader-text">Assembling practice session...</span>
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="dash-header">
          <div className="dash-header__left">
            <button className="back-subjects-btn" onClick={onBack}>
              <svg className="btn-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Exit Practice</span>
            </button>
            <span className="logo-text" style={{ marginLeft: '1rem' }}>Practice: {subjectCode}</span>
          </div>
          <div className="dash-header__right">
             <button className="change-campus-btn" onClick={onToggleTheme}>
               {theme === 'light' ? '🌙' : '☀️'}
             </button>
          </div>
        </header>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--dash-text-color)', fontFamily: 'var(--font-body)', gap: '1rem', padding: '2rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '64px', height: '64px', opacity: 0.5 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>No Practice Questions Found</h2>
          <p style={{ color: 'var(--dash-text-muted)', textAlign: 'center', maxWidth: '400px' }}>
            We couldn't find any questions matching your selected filters ({selectedModules.join(', ')} - {difficulties.join(', ')} difficulties). Try broadening your module selection.
          </p>
          <button className="back-subjects-btn" onClick={onBack} style={{ marginTop: '1rem', background: 'var(--dash-active-module-bg)', color: '#fff', border: 'none' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }


  const handleCheckAnswer = async () => {
    const answer = userAnswers[currentIndex] || '';
    if (!answer.trim()) return;

    setLoadingCheck(true);
    try {
      const res = await fetch('http://localhost:3001/api/practice/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentQ.uid, answer })
      });
      const data = await res.json();
      
      const isCorrect = data.isCorrect;
      setFeedbacks(prev => ({ ...prev, [currentIndex]: isCorrect ? 'correct' : 'incorrect' }));
      setStatuses(prev => ({ ...prev, [currentIndex]: isCorrect ? 'correct' : 'incorrect' }));
      setSolutions(prev => ({ ...prev, [currentIndex]: data }));
    } catch (err) {
      console.error("Error checking answer:", err);
    }
    setLoadingCheck(false);
  };

  const handleRevealSolution = async () => {
    if (solutions[currentIndex]) {
      setShowSolutionPanel(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
      return;
    }

    setLoadingCheck(true);
    try {
      const res = await fetch('http://localhost:3001/api/practice/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentQ.uid })
      });
      const data = await res.json();
      setSolutions(prev => ({ ...prev, [currentIndex]: data }));
      setShowSolutionPanel(prev => ({ ...prev, [currentIndex]: true }));
    } catch (err) {
      console.error("Error fetching solution:", err);
    }
    setLoadingCheck(false);
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Practice Header */}
      <header className="dash-header">
        <div className="dash-header__left">
          <button className="back-subjects-btn" onClick={onBack}>
            <svg className="btn-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Exit Practice</span>
          </button>
          <span className="logo-text" style={{ marginLeft: '1.5rem' }}>Practice Environment</span>
        </div>
        <div className="dash-header__right">
           <button className="change-campus-btn" onClick={onToggleTheme}>
             {theme === 'light' ? '🌙' : '☀️'}
           </button>
        </div>
      </header>

      {/* Main 2-Column Practice Layout */}
      <div className="practice-mode-layout">
        
        {/* Left Column: Active Question Workspace */}
        <main className="practice-left-column">
          
          {/* Question Box Card */}
          <div className="question-container-box">
            
            {/* Badges and tags header */}
            <div className="question-header-meta">
              <span className="badge-practice">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="badge-practice">
                Module {currentQ.module}
              </span>
              <span className={`badge-practice badge-difficulty-${currentQ.difficulty.toLowerCase()}`}>
                {currentQ.difficulty}
              </span>
              <span className="badge-practice">
                {currentQ.marks} Marks
              </span>
              {currentQ.exam && (
                <span className="badge-practice" style={{ borderColor: 'var(--dash-active-module-bg)', color: 'var(--dash-active-module-bg)', background: 'rgba(198, 85, 117, 0.05)' }}>
                  {currentQ.exam} ({currentQ.year || '2024'})
                </span>
              )}
            </div>

            {/* LaTeX Render Area */}
            <div className="question-render-area">
              {renderLatex(currentQ.question_latex || currentQ.question_text)}
            </div>

            {/* User Interaction Zone */}
            <div className="interactive-action-zone">
              
              {/* Numerical/Short-Answer Input Form */}
              {isNumerical && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="numerical-input-group">
                    <input 
                      type="text" 
                      className="pq-input-premium"
                      placeholder="Type your final answer here..."
                      value={userAnswers[currentIndex] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserAnswers(prev => ({ ...prev, [currentIndex]: val }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckAnswer();
                      }}
                    />
                    <button 
                      className="pq-btn-submit"
                      onClick={handleCheckAnswer}
                      disabled={loadingCheck || !(userAnswers[currentIndex] || '').trim()}
                    >
                      {loadingCheck ? 'Checking...' : 'Check Answer'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)', margin: '0' }}>
                    Note: Answers are case-insensitive and normalized for mathematical formatting.
                  </p>
                </div>
              )}

              {/* MCQ Options Selector Grid */}
              {isMcq && (
                <div className="mcq-options-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--dash-text-color)', margin: '0' }}>
                    Select the correct option:
                  </p>
                  <div className="mcq-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {mcqChoices.map((choice, idx) => {
                      const letter = String.fromCharCode(65 + idx); // A, B, C, D
                      const isSelected = userAnswers[currentIndex] === choice;
                      const isChecked = feedbacks[currentIndex];
                      const isCorrectChoice = choice === currentQ.final_answer;
                      
                      let choiceClass = "mcq-option-btn";
                      if (isSelected) choiceClass += " selected";
                      if (isChecked) {
                        if (isCorrectChoice) choiceClass += " correct-choice";
                        else if (isSelected) choiceClass += " incorrect-choice";
                      }
                      
                      return (
                        <button
                          key={idx}
                          className={choiceClass}
                          onClick={() => {
                            if (feedbacks[currentIndex]) return;
                            setUserAnswers(prev => ({ ...prev, [currentIndex]: choice }));
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: isSelected 
                              ? 'var(--dash-active-module-bg)' 
                              : 'var(--dash-card-bg)',
                            border: isSelected 
                              ? '1.5px solid var(--dash-active-module-bg)' 
                              : '1px solid rgba(0,0,0,0.08)',
                            color: isSelected ? '#fff' : 'var(--dash-text-color)',
                            borderRadius: '12px',
                            textAlign: 'left',
                            cursor: feedbacks[currentIndex] ? 'not-allowed' : 'pointer',
                            transition: 'all 0.25s ease',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
                            backdropFilter: 'blur(10px)',
                            fontFamily: 'var(--font-body)'
                          }}
                        >
                          <div 
                            className="mcq-letter-badge"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                              color: isSelected ? '#fff' : 'var(--dash-text-color)',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              flexShrink: 0
                            }}
                          >
                            {letter}
                          </div>
                          <div className="mcq-choice-text" style={{ flexGrow: 1, fontSize: '0.95rem' }}>
                            {renderLatex(choice)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {!feedbacks[currentIndex] && (
                    <button 
                      className="pq-btn-submit"
                      onClick={handleCheckAnswer}
                      disabled={loadingCheck || !userAnswers[currentIndex]}
                      style={{ width: 'fit-content', marginTop: '0.5rem' }}
                    >
                      {loadingCheck ? 'Checking...' : 'Check Answer'}
                    </button>
                  )}
                </div>
              )}

              {/* Feedback Banner */}
              {feedbacks[currentIndex] && (
                <div className={`banner-feedback-premium ${feedbacks[currentIndex]}`}>
                  {feedbacks[currentIndex] === 'correct' ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '20px', height: '20px' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>🎉 Spot on! Correct Answer. Expand the solution below for detailed steps.</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '20px', height: '20px' }}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span>❌ Incorrect. Double-check your calculation, or expand the step-by-step solution.</span>
                    </>
                  )}
                </div>
              )}

              {/* Show Solution Button / Expansion Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  className="btn-nav-premium"
                  onClick={handleRevealSolution}
                  disabled={loadingCheck}
                  style={{ width: 'fit-content', background: 'rgba(0,0,0,0.03)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{showSolutionPanel[currentIndex] ? 'Hide Explanation' : 'View Step-by-Step Solution'}</span>
                </button>

                {showSolutionPanel[currentIndex] && solutions[currentIndex] && (
                  <div className="solution-container-premium">
                    <h4>Detailed LaTeX Derivation &amp; Solution</h4>
                    <div className="solution-content-math">
                      {renderLatex(solutions[currentIndex].solutionLatex || solutions[currentIndex].solutionText)}
                    </div>
                    {solutions[currentIndex].correctAnswer && (
                      <div className="solution-final-ans-pill">
                        <strong>Expected Value: </strong> 
                        <span style={{ marginLeft: '4px' }}>
                          {renderLatex(solutions[currentIndex].correctAnswer)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Sequential Next / Prev Controls */}
          <div className="question-nav-controls-row">
            <button 
              className="btn-nav-premium"
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              ← Previous Question
            </button>
            <button 
              className="btn-nav-premium"
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIndex === totalQuestions - 1}
            >
              Next Question →
            </button>
          </div>

        </main>

        {/* Right Column: Statistics and Session Navigation Grid */}
        <aside className="practice-right-sidebar">
          
          {/* Attempt Statistics Panel */}
          <div className="panel-sidebar-premium">
            <span className="panel-sidebar-title">Attempt Statistics</span>
            <div className="stats-grid-dashboard">
              <div className="stat-item-premium">
                <span className="stat-num-val" style={{ color: 'var(--dash-active-module-bg)' }}>{attemptedCount}</span>
                <span className="stat-label-desc">Attempted</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-num-val correct">{correctCount}</span>
                <span className="stat-label-desc">Correct</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-num-val wrong">{incorrectCount}</span>
                <span className="stat-label-desc">Wrong</span>
              </div>
              <div className="stat-item-premium">
                <span className="stat-num-val" style={{ color: '#f1c40f' }}>{accuracy}%</span>
                <span className="stat-label-desc">Accuracy</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--dash-text-muted)' }}>Progress Meter</span>
              <div className="accuracy-bar-track">
                <div className="accuracy-bar-fill" style={{ width: `${Math.round((attemptedCount / totalQuestions) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Interactive Question Grid Selector Panel */}
          <div className="panel-sidebar-premium">
            <span className="panel-sidebar-title">Question Navigator Grid</span>
            <div className="questions-circles-grid">
              {questions.map((_, idx) => {
                const qStatus = statuses[idx] || 'unattempted';
                const isActive = currentIndex === idx;
                
                let btnClass = 'circle-nav-node';
                if (isActive) btnClass += ' active';
                if (qStatus === 'correct') btnClass += ' correct';
                else if (qStatus === 'incorrect') btnClass += ' incorrect';
                else if (qStatus === 'unattempted') btnClass += ' not-visited';

                return (
                  <button 
                    key={idx}
                    className={btnClass}
                    onClick={() => setCurrentIndex(idx)}
                    title={`Go to Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', fontSize: '0.75rem', color: 'var(--dash-text-muted)', borderTop: '1px solid var(--dash-panel-border)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }}></span>
                <span>Correct Answer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e74c3c', display: 'inline-block' }}></span>
                <span>Incorrect Answer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--dash-panel-border)', display: 'inline-block' }}></span>
                <span>Unattempted / Not Visited</span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default PracticeMode;
