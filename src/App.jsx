import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Volume2, VolumeX, Home, ChevronLeft, ChevronRight, LockKeyhole, Check, Sparkles, RotateCcw } from 'lucide-react';
import { frac, add, mul, toAria } from './core/fraction/index.js';
import { initialState } from './app/initialState.js';
import { reducer } from './app/reducer.js';
import { loadState, saveState } from './app/persistence.js';
import { levels, levelOrder } from './config/levels.js';
import { stories } from './content/story.js';
import { starsFor, unlockedLevels } from './utils/scoring.js';

const phaseNames = ['wonder', 'story', 'simulate', 'play', 'reflect'];
const fractionQuestions = {
  easy: [
    { prompt: 'A bar is cut into 6 equal parts. Five are shaded. What fraction is shaded?', n: 5, d: 6, options: [[5,6],[6,5],[1,6],[5,11]], tag: 'SWAP_NUM_DEN', visual: [6,5] },
    { prompt: 'Which fraction is greater?', compare: true, left: [3,8], right: [3,5], options: [[3,8],[3,5],[6,13],[1,2]], correct: 1, tag: 'BIG_DENOM_BIG_FRACTION' },
    { prompt: 'Which fraction is equivalent to one half?', options: [[1,2],[2,3],[3,8],[4,10]], correct: 0, tag: 'EQUIV_ADD_NOT_MULT' },
    { prompt: 'Two sevenths plus three sevenths equals…', options: [[5,7],[5,14],[6,7],[2,7]], correct: 0, tag: 'ADD_DENOMINATORS' },
  ],
  medium: [
    { prompt: 'Write twelve sixths in simplest form.', options: [[2,1],[6,12],[2,6],[1,2]], correct: 0, tag: 'SIMPLIFY_PARTIAL' },
    { prompt: 'Which is the mixed number for seventeen fifths?', options: ['3 and 2/5','2 and 3/5','3 and 5/2','4 and 1/5'], correct: 0, tag: 'IMPROPER_REMAINDER_MISUSE' },
    { prompt: 'Five sixths minus one half equals…', options: [[1,3],[2,6],[4,6],[1,2]], correct: 0, tag: 'ADD_NUM_KEEP_DEN_UNLIKE' },
    { prompt: 'Three quarters of 24 crabs are in the reef. How many crabs?', options: [18, 6, 8, 21], correct: 0, tag: 'OF_MEANS_ONE_PART' },
  ],
  hard: [
    { prompt: 'Two thirds times three quarters equals…', options: [[1,2],[6,7],[6,12],[5,12]], correct: 0, tag: 'MULT_ADD_CONFUSION' },
    { prompt: 'How many quarter-lengths fit inside 3 whole lengths?', options: [12, 3, 4, 7], correct: 0, tag: 'DIV_WHOLE_BY_FRACTION_SHRINKS' },
    { prompt: 'A fraction of a fraction is best shown first with a…', options: ['area model','number line','clock','tally mark'], correct: 0, tag: 'RANDOM_NEAR' },
    { prompt: 'Otto asks: “Is it in simplest form — and does the answer make sense?” This is his…', options: ['third question','first question','secret password','station rule'], correct: 0, tag: 'RANDOM_NEAR' },
  ],
};

const simulationStations = {
  easy: [
    { id: 'equal-parts', title: 'Fair-share scanner', icon: '🪵', kicker: 'MISSION 1 · SPOT THE FAIR SHARE', prompt: 'The dock plank must be split fairly. Which plan creates equal-sized parts?', options: ['3 parts: 1 short, 1 long, 1 short', '4 parts: all the same length', '5 parts: 2 long, 3 short'], answer: 1, hint: 'The denominator counts equal parts. Look for matching lengths.', visual: 'equal' },
    { id: 'fraction-wall', title: 'Fraction-wall match', icon: '🧱', kicker: 'MISSION 2 · MAKE THE PIECES MATCH', prompt: 'The lighthouse needs the same amount as one half. Which fraction is equivalent?', options: ['2/3', '2/4', '3/5'], answer: 1, hint: 'Two fourths cover the same length as one half.', visual: 'wall' },
    { id: 'supply-share', title: 'Supply crate share', icon: '⛵', kicker: 'MISSION 3 · SHARE THE SET', prompt: 'Three quarters of 12 supply crates go to the dock. How many crates is that?', options: ['3 crates', '8 crates', '9 crates'], answer: 2, hint: 'Find one quarter first, then take three of those groups.', visual: 'crates' },
    { id: 'oops-desk', title: 'Oops Desk: fair or flawed?', icon: '🔍', kicker: 'MISSION 4 · CATCH THE MISTAKE', prompt: 'Danish says: “A bigger denominator always means a bigger fraction.” What should Otto circle?', options: ['Correct: bigger denominator wins', 'Flawed: more equal pieces can make each piece smaller', 'Correct only for halves'], answer: 1, hint: 'Ask whether the pieces themselves get bigger or smaller.', visual: 'oops' },
  ],
  medium: [
    { id: 'mixed-builder', title: 'Mixed-number builder', icon: '🧩', kicker: 'MISSION 1 · REBUILD THE WHOLE', prompt: 'The reef has 17 fifths of rope. Which mixed number says the same amount?', options: ['2 and 3/5', '3 and 2/5', '3 and 5/2'], answer: 1, hint: 'Count complete groups of five, then keep the remainder.', visual: 'mixed' },
    { id: 'common-ground', title: 'Common-ground bridge', icon: '🌉', kicker: 'MISSION 2 · FIND A COMMON UNIT', prompt: 'To combine one half and one third, which denominator gives both fractions equal-sized pieces?', options: ['5', '6', '9'], answer: 1, hint: 'Find a number that both 2 and 3 divide into exactly.', visual: 'ground' },
    { id: 'crew-split', title: 'Crew-share calculator', icon: '🦀', kicker: 'MISSION 3 · FRACTION OF A SET', prompt: 'Three quarters of 24 reef tools are blue. How many blue tools are there?', options: ['6', '18', '21'], answer: 1, hint: 'A quarter of 24 is 6. Three quarters is three groups of 6.', visual: 'crew' },
    { id: 'oops-medium', title: 'Oops Desk: denominator trap', icon: '🔍', kicker: 'MISSION 4 · EXPLAIN THE ERROR', prompt: 'A learner writes 1/2 + 1/3 = 2/5. Which explanation is strongest?', options: ['The top numbers should be multiplied', 'The pieces are different sizes, so make a common denominator first', 'The answer must always be less than one'], answer: 1, hint: 'You cannot count halves and thirds together until the pieces match.', visual: 'oops' },
  ],
  hard: [
    { id: 'slice-slice', title: 'Slice of a slice', icon: '🥧', kicker: 'MISSION 1 · MODEL MULTIPLICATION', prompt: 'Which model matches two thirds of three quarters?', options: ['1/2', '5/7', '6/12'], answer: 0, hint: 'Multiply the numerators and denominators, then simplify the area.', visual: 'area' },
    { id: 'share-bridge', title: 'How many fit?', icon: '🌉', kicker: 'MISSION 2 · MODEL DIVISION', prompt: 'How many quarter-lengths fit inside 3 whole bridge lengths?', options: ['3', '7', '12'], answer: 2, hint: 'Each whole bridge contains four quarter-lengths.', visual: 'bridge' },
    { id: 'bar-model', title: 'Bar-model workshop', icon: '📐', kicker: 'MISSION 3 · TRACK THE WHOLE', prompt: 'A traveller spends one third of a fund, then one half of the remainder. Which fraction is left?', options: ['1/3', '1/2', '2/3'], answer: 0, hint: 'After spending one third, the remainder is two thirds. Half of that is one third.', visual: 'bar-model' },
    { id: 'oops-hard', title: 'Oops Desk: reason it out', icon: '🔍', kicker: 'MISSION 4 · BE THE ERROR DETECTIVE', prompt: 'Someone says “divide by a fraction, so the answer must shrink.” What is the correction?', options: ['Division by a unit fraction counts how many fit, so it can grow', 'Division always shrinks', 'Only multiplication can make a number larger'], answer: 0, hint: 'Ask how many one-quarter groups fit inside a whole.', visual: 'oops' },
  ],
};

function Frac({ n, d, size = '' }) { return <span className={`fraction ${size}`} role="img" aria-label={toAria({ n, d })}><span>{n}</span><span className="fraction-rule" /><span>{d}</span></span>; }
function formatOption(option) { if (Array.isArray(option)) return <Frac n={option[0]} d={option[1]} />; return option; }

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, (fresh) => loadState() || fresh);
  useEffect(() => { saveState(state); }, [state]);
  const unlocked = unlockedLevels(state);
  const level = levels[state.level];
  const go = (phase) => dispatch({ type: 'SET_PHASE', phase });
  return <div className={`app ${state.calmMotion ? 'calm' : ''}`}>
    <Header state={state} level={level} go={go} dispatch={dispatch} />
    <main className="main">
      {state.phase === 'intro' && <Intro dispatch={dispatch} />}
      {state.phase === 'hub' && <Hub state={state} dispatch={dispatch} unlocked={unlocked} />}
      {state.phase === 'wonder' && <Wonder state={state} dispatch={dispatch} />}
      {state.phase === 'story' && <Story state={state} dispatch={dispatch} />}
      {state.phase === 'simulate' && <Simulate state={state} dispatch={dispatch} />}
      {state.phase === 'play' && <Play state={state} dispatch={dispatch} />}
      {state.phase === 'reflect' && <Reflect dispatch={dispatch} />}
      {state.phase === 'certificate' && <Certificate state={state} dispatch={dispatch} />}
    </main>
  </div>;
}

function Header({ state, level, go, dispatch }) {
  const active = state.phase === 'intro' || state.phase === 'certificate' ? '' : state.phase;
  return <header className="topbar">
    <button className="brand" onClick={() => go('hub')} aria-label="Go to island hub"><span className="brand-mark">⅓</span><span>Fraction Isles</span></button>
    <nav className="phase-nav" aria-label="Learning phases">{phaseNames.map((phase) => <button key={phase} className={`phase-pill ${active === phase ? 'active' : ''}`} onClick={() => phase !== 'reflect' || state.levels.hard.boss ? go(phase) : null}>{phase[0].toUpperCase() + phase.slice(1)}</button>)}</nav>
    <div className="top-actions"><span className="level-chip">{level.icon} {level.label}</span><div className="stats"><span className="stat-chip">✨ {state.scoring.xp} XP</span><span className="stat-chip">🔥 {state.scoring.streak}</span></div><button className="icon-button" onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })} aria-label={state.audioEnabled ? 'Turn audio off' : 'Turn audio on'}>{state.audioEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}</button></div>
  </header>;
}

function Intro({ dispatch }) { const [nickname, setNickname] = useState(''); return <section className="hero screen"><div className="hero-copy"><div className="eyebrow">A fraction adventure for curious builders · grades 4–8</div><h1>Rebuild the isles, one piece at a time.</h1><p>Explore, experiment, and outsmart fraction traps with Mei, Danish, and Otto. Every island gives you a hands-on mission before the challenge questions begin.</p><div className="cta-row"><input className="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={12} placeholder="Your name (optional)" aria-label="Your name" /><button className="primary" onClick={() => dispatch({ type: 'START', nickname })}>Set sail <ChevronRight size={19} /></button></div><p className="muted">Designed for learners in Grades 4–8 · no account needed · progress stays on this device.</p></div><div className="island-illustration" aria-label="A cheerful tropical island illustration" role="img">🏝️</div></section>; }

function Hub({ state, dispatch, unlocked }) { return <section className="screen"><div className="section-heading"><div><div className="eyebrow">Your three-step learning map</div><h2>See it · use it · solve it</h2><p>Each level starts with a visual idea, lets you practise it, then gives you a challenge.</p></div><button className="secondary" onClick={() => dispatch({ type: 'NEW_GAME' })}><RotateCcw size={17} /> New game</button></div><div className="learning-arc"><span className="arc-node active">1 <b>See it</b></span><span className="arc-line" /><span className="arc-node">2 <b>Use it</b></span><span className="arc-line" /><span className="arc-node">3 <b>Solve it</b></span></div><div className="island-grid">{levelOrder.map((id) => { const item = levels[id]; const p = state.levels[id]; const canEnter = unlocked[id]; const progress = Math.round((p.stations.filter(Boolean).length + p.stars) / 7 * 100); return <article className={`card island-card level-card ${canEnter ? '' : 'locked'}`} key={id}><div><div className="level-card-top"><div className="island-icon">{item.icon}</div><span className={`stage-badge stage-${id}`}>{item.stage}</span></div><div className="eyebrow">{item.label}</div><h3>{item.name}</h3><div className="focus-chip">{item.focus}</div><p>{canEnter ? item.description : 'Finish the previous level to unlock this new set of tools.'}</p></div><div><div className="mini-journey"><span>Visual</span><i>→</i><span>Mission</span><i>→</i><span>Challenge</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${canEnter ? progress : 0}%` }} /></div><button className={canEnter ? 'primary' : 'secondary'} disabled={!canEnter} onClick={() => { dispatch({ type: 'SET_LEVEL', level: id }); dispatch({ type: 'SET_PHASE', phase: p.storyPanel > 0 ? 'simulate' : 'story' }); }}>{canEnter ? 'Enter level' : <><LockKeyhole size={16} /> Locked</>}</button></div></article>; })}</div></section>; }

function Wonder({ state, dispatch }) { const [choice, setChoice] = useState(null); const beats = [{ title: 'Spot the whole', body: 'Tap the thing that shows one complete whole.', icon: '🥥', visual: 'whole', options: ['One full coconut bar', 'One small piece'], answer: 0 }, { title: 'Make it fair', body: 'Which share would you trust?', icon: '👁️', visual: 'equal', options: ['Equal pieces', 'Unequal pieces'], answer: 0 }, { title: 'Name the parts', body: 'Count all the pieces, then the shaded pieces.', icon: '🧭', visual: 'fraction', options: ['3/4', '4/3'], answer: 0 }]; const beat = beats[state.wonderStep]; const correct = choice === beat.answer; const next = () => { if (choice === null) return; dispatch({ type: 'WONDER_NEXT', done: state.wonderStep === 2 }); setChoice(null); }; return <section className="card screen wonder-card"><div className="eyebrow">Wonder · see it first · {state.wonderStep + 1} of 3</div><div className="wonder-grid"><div><div className="wonder-icon">{beat.icon}</div><h2>{beat.title}</h2><p>{beat.body}</p><div className="wonder-options">{beat.options.map((option, index) => <button key={option} className={choice === index ? 'selected' : ''} onClick={() => setChoice(index)}>{option}</button>)}</div></div><ActivityVisual kind={beat.visual} /></div>{choice !== null && <div className={`wonder-feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Nice visual check!' : 'Look again — use the picture, not a guess.'}</div>}<div className="cta-row"><button className="primary" onClick={next} disabled={choice === null}>{state.wonderStep === 2 ? 'Visit Beginner level' : 'Next visual'} <ChevronRight size={19} /></button></div></section>; }

function Story({ state, dispatch }) { const story = stories[state.level]; const p = state.levels[state.level]; const panel = story.panels[p.storyPanel]; return <section className="screen"><div className="section-heading"><div><div className="eyebrow">Visual story · {levels[state.level].stage}</div><h2>{story.title}</h2></div><span className="level-chip">{levels[state.level].icon} {levels[state.level].focus}</span></div><div className="story-layout"><div className="story-art story-art-visual" role="img" aria-label={panel.title}><div className="story-art-emoji">{panel.art}</div><ActivityVisual kind={panel.visual} /></div><article className="card story-copy"><div className="eyebrow">{panel.kicker}</div><h2>{panel.title}</h2><p className="story-short-copy">{panel.body}</p><div className="story-takeaway"><span>LOOK</span><strong>{panel.idea}</strong></div><div className="story-dots" aria-label={`Panel ${p.storyPanel + 1} of 3`}>{story.panels.map((_, i) => <span key={i} className={`dot ${i === p.storyPanel ? 'active' : ''}`} />)}</div><div className="cta-row"><button className="secondary" disabled={p.storyPanel === 0} onClick={() => dispatch({ type: 'STORY_PREV' })}><ChevronLeft size={18} /> Back</button><button className="primary" onClick={() => dispatch({ type: 'STORY_NEXT', last: p.storyPanel === 2 })}>{p.storyPanel === 2 ? 'Open missions' : 'Next visual'} <ChevronRight size={18} /></button></div></article></div></section>; }

function ActivityVisual({ kind }) {
  if (kind === 'whole') return <div className="activity-visual concept-visual"><div className="whole-shape">ONE WHOLE</div><div className="whole-piece">one piece</div></div>;
  if (kind === 'fraction') return <div className="activity-visual fraction-visual"><div className="mini-bar fraction-bar"><span className="filled" /><span className="filled" /><span className="filled" /><span /></div><strong>3 of 4 parts are shaded</strong></div>;
  if (kind === 'equivalent') return <div className="activity-visual big-symbol"><strong>1/2</strong><span>=</span><strong>2/4</strong><span>=</span><strong>3/6</strong></div>;
  if (kind === 'simplify') return <div className="activity-visual big-symbol"><strong>6/8</strong><span>÷ 2</span><strong>3/4</strong></div>;
  if (kind === 'equal') return <div className="activity-visual equal-visual"><div className="visual-label">PLAN A</div><div className="mini-bar"><span /><span className="short" /><span /></div><div className="visual-label">PLAN B</div><div className="mini-bar"><span /><span /><span /><span /></div><div className="visual-label">PLAN C</div><div className="mini-bar"><span className="long" /><span className="short" /><span className="short" /></div></div>;
  if (kind === 'wall') return <div className="activity-visual wall-visual"><div><strong>1/2</strong><span className="wall-row"><i /><i /></span></div><div><strong>2/4</strong><span className="wall-row four"><i /><i /><i /><i /></span></div></div>;
  if (kind === 'crates' || kind === 'crew') return <div className="activity-visual crate-visual"><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span><span>📦</span></div>;
  if (kind === 'mixed') return <div className="activity-visual big-symbol"><strong>17/5</strong><span>→</span><strong>3 + 2/5</strong></div>;
  if (kind === 'ground') return <div className="activity-visual big-symbol"><strong>1/2</strong><span>+</span><strong>1/3</strong><span>→ ? / 6</span></div>;
  if (kind === 'area') return <div className="activity-visual area-visual">{Array.from({ length: 12 }, (_, index) => <i className={index < 6 ? 'area-shade' : ''} key={index} />)}</div>;
  if (kind === 'bridge') return <div className="activity-visual bridge-visual"><span>WHOLE</span><span>WHOLE</span><span>WHOLE</span><small>each whole contains 4 quarter-lengths</small></div>;
  if (kind === 'divide') return <div className="activity-visual bridge-visual"><span>3 WHOLES</span><span>÷ 1/4</span><strong>12 QUARTERS</strong></div>;
  if (kind === 'bar') return <div className="activity-visual bar-model-visual"><span className="spent-one">1/3</span><span className="remainder">2/3 remains</span></div>;
  if (kind === 'bar-model') return <div className="activity-visual bar-model-visual"><span className="spent-one">1/3 spent</span><span className="remainder">2/3 remains</span></div>;
  return <div className="activity-visual oops-visual"><span>“I rushed.”</span><strong>Pause. Check the pieces.</strong><span>“Does my answer make sense?”</span></div>;
}

function Simulate({ state, dispatch }) {
  const p = state.levels[state.level];
  const stations = simulationStations[state.level];
  const firstIncomplete = p.stations.findIndex((done) => !done);
  const [active, setActive] = useState(firstIncomplete === -1 ? 0 : firstIncomplete);
  const [picked, setPicked] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const current = stations[active];
  const isCorrect = picked === current.answer;

  useEffect(() => {
    const next = p.stations.findIndex((done) => !done);
    setActive(next === -1 ? 0 : next);
    setPicked(null);
    setSubmitted(false);
  }, [state.level, p.stations.join(',')]);

  const completeStation = () => {
    if (!submitted || !isCorrect) return;
    const allDone = p.stations.every((done, index) => done || index === active);
    dispatch({ type: 'STATION_COMPLETE', station: active, allDone });
  };

  if (p.stations.every(Boolean)) return <section className="card screen" style={{ maxWidth: 820, margin: '30px auto', textAlign: 'center', background: '#e8fff4' }}><div style={{ fontSize: 72 }}>🧭</div><div className="eyebrow">Strategy lab complete</div><h2>All four missions cleared</h2><p>You tested the idea with models, caught a common trap, and explained your reasoning. Practice is now unlocked.</p><button className="primary" onClick={() => dispatch({ type: 'SET_PHASE', phase: 'play' })}>Start practice <ChevronRight size={18} /></button></section>;

  return <section className="screen simulate-shell">
    <div className="section-heading"><div><div className="eyebrow">Simulate · hands-on strategy lab</div><h2>Build it before you calculate</h2><p>Four missions turn the idea into something you can see, test, and explain. Complete the current mission to unlock the next one.</p></div><div className="level-chip">{p.stations.filter(Boolean).length} / 4 missions</div></div>
    <div className="station-rail" aria-label="Simulation missions">{stations.map((station, index) => <button key={station.id} className={`station-step ${active === index ? 'active' : ''} ${p.stations[index] ? 'done' : ''}`} onClick={() => !p.stations[index] && setActive(index)} disabled={p.stations[index] || index > firstIncomplete && !p.stations[index - 1]}><span className="station-step-number">{p.stations[index] ? <Check size={16} /> : index + 1}</span><span>{station.title}</span></button>)}</div>
    <div className="simulate-layout">
      <aside className="card otto-card"><div className="otto-avatar">🦦</div><div className="eyebrow">Otto’s field note</div><h3>Before you lock it in…</h3><p>Ask yourself: <strong>Are the pieces equal?</strong> Then explain what the numerator and denominator are doing.</p><div className="mission-meter"><span style={{ width: `${((p.stations.filter(Boolean).length) / 4) * 100}%` }} /></div><small>{p.stations.filter(Boolean).length} of 4 missions cleared</small></aside>
      <article className="card activity-stage"><div className="activity-kicker">{current.kicker}</div><div className="activity-title-row"><div><h3>{current.title}</h3><p className="activity-prompt">{current.prompt}</p></div><div className="activity-icon">{current.icon}</div></div><ActivityVisual kind={current.visual} /><div className="activity-options" role="radiogroup" aria-label="Choose an answer">{current.options.map((option, index) => <button key={option} className={`activity-option ${picked === index ? 'selected' : ''}`} onClick={() => { setPicked(index); setSubmitted(false); }} disabled={submitted} role="radio" aria-checked={picked === index}>{option}</button>)}</div>{submitted && <div className={`activity-feedback ${isCorrect ? 'success' : 'try-again'}`}><strong>{isCorrect ? 'Mission solved! ' : 'Not quite yet. '}</strong>{isCorrect ? 'You made a choice and can explain why it works.' : current.hint}</div>}<div className="activity-actions"><button className="secondary" onClick={() => { setPicked(null); setSubmitted(false); }}>Reset</button><button className="primary" onClick={() => setSubmitted(true)} disabled={picked === null || submitted}>Check mission</button><button className="primary complete-button" onClick={completeStation} disabled={!submitted || !isCorrect}>{p.stations[active] ? 'Mission cleared' : 'Complete station'} <Check size={17} /></button></div></article>
    </div>
  </section>;
}

function Play({ state, dispatch }) { const p = state.levels[state.level]; const questions = fractionQuestions[state.level]; const index = p.questions.findIndex((_, i) => !p.questions[i]); const qIndex = index === -1 ? questions.length : index; if (qIndex >= questions.length) return <LevelComplete state={state} dispatch={dispatch} />; return <Question key={qIndex} state={state} dispatch={dispatch} q={questions[qIndex]} index={qIndex} total={questions.length} />; }

function Question({ state, dispatch, q, index, total }) { const [picked, setPicked] = useState(null); const [submitted, setSubmitted] = useState(false); const correctIndex = q.correct ?? (q.options.findIndex((option) => Array.isArray(option) && option[0] === q.n && option[1] === q.d)); const correct = picked === correctIndex; const submit = () => { if (picked !== null) setSubmitted(true); }; const next = () => dispatch({ type: 'ANSWER', index, correct, tag: q.tag }); return <section className="screen"><div className="section-heading"><div><div className="eyebrow">Play · question {index + 1} of {total}</div><h2>Choose the right tool</h2></div><span className="level-chip">{state.levels[state.level].answers.filter((answer) => answer.correct).length} correct</span></div><div className="practice-layout"><aside className="card"><div className="eyebrow">Otto’s three questions</div><h3>Before you answer…</h3><ol style={{ paddingLeft: 22, color: 'var(--ink-600)', lineHeight: 1.8 }}><li>Are the pieces equal?</li><li>Are the pieces the same size?</li><li>Is it simplest, and does it make sense?</li></ol><div className="model-bar" aria-label="Fraction model">{q.visual && Array.from({ length: q.visual[0] }, (_, i) => <span className={`model-part ${i < q.visual[1] ? 'shaded' : ''}`} key={i} />)}</div></aside><article className="card question-card"><div className="eyebrow">{state.level === 'easy' ? 'SHARE FAIRLY' : state.level === 'medium' ? 'MAKE IT FIT' : 'EXPLAIN THE MODEL'}</div><h3 style={{ fontSize: 30, lineHeight: 1.3 }}>{q.prompt}</h3>{q.compare && <p style={{ fontSize: 28 }}><Frac n={q.left[0]} d={q.left[1]} /> or <Frac n={q.right[0]} d={q.right[1]} />?</p>}<div className="answer-options">{q.options.map((option, optionIndex) => <button key={optionIndex} disabled={submitted} className="answer-option" onClick={() => setPicked(optionIndex)} style={picked === optionIndex ? { borderColor: 'var(--coral-500)', background: '#fff0ed' } : {}}>{formatOption(option)}</button>)}</div>{submitted && <div className={`feedback ${correct ? '' : 'wrong'}`}>{correct ? <><Sparkles size={18} /> Yes! You checked the pieces before choosing.</> : <>Good try. Otto says: {q.tag === 'SWAP_NUM_DEN' ? 'the top counts selected parts and the bottom counts all equal parts.' : 'draw or count the equal parts before committing.'}</>}</div>}<div className="cta-row"><button className="primary" onClick={submit} disabled={picked === null || submitted}>{submitted ? <><Check size={18} /> Answer checked</> : 'Check answer'}</button>{submitted && <button className="secondary" onClick={next}>Next question <ChevronRight size={18} /></button>}</div></article></div></section>; }

function LevelComplete({ state, dispatch }) { const p = state.levels[state.level]; const correct = p.answers.filter((answer) => answer.correct).length; const stars = starsFor(correct, p.questions.length); const next = state.level === 'easy' ? 'medium' : state.level === 'medium' ? 'hard' : null; return <section className="card screen" style={{ maxWidth: 760, margin: '30px auto', textAlign: 'center' }}><div style={{ fontSize: 76 }}>🏝️</div><div className="eyebrow">Island restored</div><h2>{levels[state.level].name} is glowing again</h2><p>You checked the pieces, explained your choices, and earned {correct} out of {p.questions.length} practice stars.</p><div style={{ fontSize: 46, letterSpacing: 8, margin: '20px 0' }}>{'★'.repeat(stars)}<span style={{ color: 'var(--sand-200)' }}>{'★'.repeat(3 - stars)}</span></div><button className="primary" onClick={() => dispatch({ type: 'LEVEL_COMPLETE', stars, nextLevel: next })}>{next ? `Sail to ${levels[next].name}` : 'Open Reflect'} <ChevronRight size={18} /></button></section>; }

function Reflect({ dispatch }) { const [choice, setChoice] = useState(null); const [journal, setJournal] = useState(''); return <section className="reflection card screen"><div className="eyebrow">Reflect · your builder log</div><h2>What will you remember?</h2><p>Otto’s final question: which habit will help you catch a fraction mistake next time?</p><div className="reflection-row">{['Equal parts','Same size','Simplest form','Draw a model','All three'].map((label, i) => <button className={`reflection-choice ${choice === i ? 'selected' : ''}`} onClick={() => setChoice(i)} key={label} aria-label={label}>{['🧩','📏','✨','✏️','🦦'][i]}</button>)}</div><label htmlFor="journal"><strong>One thing I can explain now:</strong></label><textarea id="journal" value={journal} onChange={(e) => setJournal(e.target.value.slice(0, 300))} rows="4" style={{ display: 'block', width: '100%', marginTop: 10, border: '2px solid var(--sand-200)', borderRadius: 14, padding: 14, resize: 'vertical' }} placeholder="Write a short note to your future self…" /><div className="cta-row"><button className="primary" disabled={choice === null} onClick={() => dispatch({ type: 'REFLECT_DONE' })}>Finish my log <Check size={18} /></button></div></section>; }

function Certificate({ state, dispatch }) { return <section className="certificate card screen"><div className="eyebrow">Fraction Isles · Island Architect</div><div className="certificate-seal">🏆</div><h2>Certificate of careful sharing</h2><p>{state.nickname ? `${state.nickname}, ` : ''}you travelled across Sunrise Shore, Tidepool Reef, and Summit Peak. You practised equal parts, equivalent fractions, operations, and bar models.</p><h3>“Before you answer, check the pieces.”</h3><p className="muted">Fraction Isles · completed on this device</p><div className="cta-row" style={{ justifyContent: 'center' }}><button className="secondary" onClick={() => dispatch({ type: 'SET_PHASE', phase: 'hub' })}><Home size={18} /> Back to hub</button><button className="primary" onClick={() => window.print()}>Print certificate</button></div></section>; }
