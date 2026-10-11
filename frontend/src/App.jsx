import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GamificationEngine from './components/GamificationEngine';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live" element={<GamificationEngine />} />
        <Route path="/notes" element={<PlaceholderPage icon="📒" title="Module Notes" subtitle="Consolidated lecture notes organized by module." color="amber" />} />
        <Route path="/flashcards" element={<PlaceholderPage icon="🃏" title="Flashcards" subtitle="Spaced-repetition flashcards for key concepts." color="purple" />} />
        <Route path="/pyqs" element={<PlaceholderPage icon="📝" title="Previous Year Questions" subtitle="Past examination questions with model answers." color="green" />} />
      </Routes>
    </BrowserRouter>
  );
}

function PlaceholderPage({ icon, title, subtitle, color }) {
  const colorMap = {
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-brand-green' },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <Link to="/" className="text-slate-500 hover:text-slate-900 mb-10 flex items-center gap-2 font-medium text-sm self-start max-w-5xl mx-auto w-full">
        ← Back to Dashboard
      </Link>
      <div className={`w-20 h-20 ${c.bg} ${c.text} rounded-2xl flex items-center justify-center text-4xl mb-6`}>
        {icon}
      </div>
      <h2 className="text-4xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-500 text-lg max-w-md">{subtitle}</p>
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-12 max-w-lg w-full">
        <p className="text-slate-400 text-sm">Content will be populated in the next phase.</p>
      </div>
    </div>
  );
}

export default App;
