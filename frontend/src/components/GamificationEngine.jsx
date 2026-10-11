import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function GamificationEngine() {
  const socketRef = useRef(null);
  const [role, setRole] = useState(null);
  const [pin, setPin] = useState('');
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:3000', { autoConnect: false });
    socketRef.current = socket;

    socket.on('error', (msg) => setError(msg));
    socket.on('new_question', (q) => { setQuestion(q); setHasAnswered(false); });
    socket.on('score_update', (s) => setScore(s));

    return () => {
      socket.off('error');
      socket.off('new_question');
      socket.off('score_update');
      socket.disconnect();
    };
  }, []);

  const createSession = async () => {
    try {
      const res = await axios.post('http://localhost:3000/session/create');
      const newPin = String(res.data.pin);
      setPin(newPin);
      socketRef.current.connect();
      socketRef.current.emit('join_session', { pin: newPin });
      setError('');
    } catch (e) {
      setError('Failed to create session');
    }
  };

  const pushQuestion = () => {
    const moduleOneQuestions = [
      { id: 'q1', text: "According to Pressman's curves, why does software deteriorate over time unlike hardware?", options: ["Physical wear and tear", "Unmanaged changes introducing defects", "Data decay", "Obsolete tooling"] },
      { id: 'q2', text: "In Scrum, if new requirements are forced into an active Sprint, who failed their job of protecting the team?", options: ["Product Owner", "Scrum Master", "Stakeholders", "Lead Developer"] },
      { id: 'q3', text: "Which CMM level indicates that a process is finally documented, standardized, and integrated across the organization?", options: ["Level 2: Repeatable", "Level 3: Defined", "Level 4: Managed", "Level 5: Optimizing"] }
    ];

    if (currentQuestionIndex < moduleOneQuestions.length) {
      const nextQ = moduleOneQuestions[currentQuestionIndex];
      socketRef.current.emit('push_question', { pin: String(pin), question: nextQ });
      setCurrentQuestionIndex(prev => prev + 1);
      setScore(0);
    } else {
      alert("End of Module 1 Syllabus Demo. Resetting to question 1.");
      setCurrentQuestionIndex(0);
    }
  };

  const joinSession = () => {
    socketRef.current.connect();
    socketRef.current.emit('join_session', { pin: String(pin) });
    setError('');
  };

  const submitAnswer = (ans) => {
    const studentId = Math.random().toString(36).substring(7);
    socketRef.current.emit('submit_answer', { pin: String(pin), studentId, answer: ans, questionId: question?.id });
    setHasAnswered(true);
  };

  /* ── Back navigation shared by all views ── */
  const BackNav = () => (
    <Link to="/" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium text-sm transition-colors">
      ← Back to Dashboard
    </Link>
  );

  /* ── Role Selection ── */
  if (!role) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="flex justify-start">
          <BackNav />
        </div>
        <h1 className="text-5xl font-bold text-slate-900">Live Classroom<span className="text-brand-blue">.</span></h1>
        <p className="text-xl text-slate-600">Great questions. Instant connections. Turn every classroom into an active learning experience.</p>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer" onClick={() => setRole('professor')}>
            <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-lg flex items-center justify-center mb-4 text-2xl">👨‍🏫</div>
            <h3 className="text-xl font-bold mb-2 text-left">Lead the learning.</h3>
            <p className="text-slate-500 text-left">Bring your class together with live questions and see every answer as it happens.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer" onClick={() => setRole('student')}>
            <div className="w-12 h-12 bg-green-100 text-brand-green rounded-lg flex items-center justify-center mb-4 text-2xl">🎓</div>
            <h3 className="text-xl font-bold mb-2 text-left">Be part of the moment.</h3>
            <p className="text-slate-500 text-left">Join your classroom, put your knowledge to the test, and make every answer count.</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Professor Console ── */
  if (role === 'professor') return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-2">
          <BackNav />
          <button onClick={() => setRole(null)} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium text-sm transition-colors">
            Change role ↻
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Professor Console</h2>
          <span className="bg-blue-100 text-brand-blue px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></div>
            READY WHEN YOU ARE
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"># Classroom session</h3>
            {pin ? (
              <div className="text-4xl font-mono font-bold tracking-widest text-slate-900 mb-6 bg-slate-100 p-4 rounded-xl text-center border border-slate-200">{pin}</div>
            ) : (
              <button onClick={createSession} className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-sm">
                Generate Session PIN
              </button>
            )}
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">📈 Live Answers Received</h3>
            <div className="text-7xl font-black text-brand-blue">{score}</div>
            <p className="text-slate-500 mt-2">Your classroom's participation, in real time.</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-700">Next Question</h3>
            <button onClick={pushQuestion} disabled={!pin} className="bg-brand-blue hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition shadow-sm">
              Push Question
            </button>
          </div>
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>}
        </div>
      </div>
    </div>
  );

  /* ── Student Reactor ── */
  if (role === 'student') return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="flex items-center justify-between mb-8">
          <BackNav />
          <button onClick={() => setRole(null)} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium text-sm transition-colors">
            Change role ↻
          </button>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">Student Reactor</h2>
        <p className="text-slate-500 mb-8">Your ideas belong in the conversation.</p>
        
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center">
          {!question ? (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 text-brand-green rounded-2xl flex items-center justify-center mx-auto text-3xl">🎓</div>
              <h3 className="text-2xl font-bold text-slate-900">Let's join your classroom.</h3>
              <p className="text-slate-500">Enter the 6-digit PIN shared by your professor.</p>
              <div className="flex flex-col gap-4 mt-8">
                <input type="text" placeholder="000000" value={pin} onChange={e => setPin(e.target.value)} className="w-full text-center text-3xl font-mono tracking-widest py-4 border-2 border-slate-200 rounded-xl focus:border-brand-blue focus:ring-0 outline-none transition" maxLength={6} />
                <button onClick={joinSession} className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-sm text-lg">Connect →</button>
              </div>
              {error && <div className="text-red-500 font-medium mt-4">{error}</div>}
            </div>
          ) : !hasAnswered ? (
            <div className="space-y-8 text-left">
              <h3 className="text-2xl font-bold text-slate-900 leading-snug">{question.text}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, i) => (
                  <button key={opt} onClick={() => submitAnswer(opt)} className="bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-brand-blue text-slate-700 font-semibold py-4 px-6 rounded-xl transition text-left flex items-center gap-4">
                    <span className="bg-white border border-slate-200 w-8 h-8 flex items-center justify-center rounded text-slate-500 text-sm">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-brand-green">Answer Recorded!</h3>
              <p className="text-slate-500">Waiting for the professor to push the next question...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
