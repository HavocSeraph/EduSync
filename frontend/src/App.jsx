import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000', { autoConnect: false });

function App() {
  const [role, setRole] = useState(null);
  const [pin, setPin] = useState('');
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    socket.on('error', (msg) => setError(msg));
    socket.on('new_question', (q) => setQuestion(q));
    socket.on('score_update', (s) => setScore(s));
    return () => {
      socket.off('error'); socket.off('new_question'); socket.off('score_update');
    };
  }, []);

  const createSession = async () => {
    try {
      const res = await axios.post('http://localhost:3000/session/create');
      setPin(res.data.pin);
      socket.connect();
      socket.emit('join_session', { pin: res.data.pin });
      setError('');
    } catch (e) {
      setError('Failed to create session');
    }
  };

  const pushQuestion = () => {
    socket.emit('push_question', { pin, question: { text: "Is the real-time engine working?", options: ["Yes", "No"] } });
  };

  const joinSession = () => {
    socket.connect();
    socket.emit('join_session', { pin });
    setError('');
  };

  const submitAnswer = (ans) => {
    const studentId = Math.random().toString(36).substring(7); // Mock ID for testing
    socket.emit('submit_answer', { pin, studentId, answer: ans });
    setHasAnswered(true);
  };

  if (!role) return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>EduSync Prototype</h1>
      <button onClick={() => setRole('professor')} style={{ marginRight: '10px' }}>Join as Professor</button>
      <button onClick={() => setRole('student')}>Join as Student</button>
    </div>
  );

  if (role === 'professor') return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', border: '2px solid blue' }}>
      <h2>Professor Console</h2>
      <button onClick={createSession}>Generate Session PIN</button>
      {pin && <h3>Active PIN: {pin}</h3>}
      <button onClick={pushQuestion} disabled={!pin}>Push Question</button>
      <h2>Live Answers Received: {score}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );

  if (role === 'student') return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', border: '2px solid green' }}>
      <h2>Student Reactor</h2>
      <input placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} style={{ marginRight: '10px' }} />
      <button onClick={joinSession}>Connect</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {question && !hasAnswered && (
        <div style={{ marginTop: '20px' }}>
          <h3>{question.text}</h3>
          {question.options.map(opt => (
            <button key={opt} onClick={() => submitAnswer(opt)} style={{ marginRight: '10px', padding: '10px' }}>{opt}</button>
          ))}
        </div>
      )}
      {hasAnswered && <h3 style={{ color: 'green' }}>Answer Submitted! Waiting for next question...</h3>}
    </div>
  );
}
export default App;
