import { useState } from 'react';
import { Link } from 'react-router-dom';

const flashcardsData = [
  {
    id: 1,
    term: 'Agile Methodology',
    category: 'Process Models',
    badgeColor: 'bg-blue-100 text-brand-blue border-blue-200',
    definition: 'An iterative, incremental approach to software engineering that emphasizes cross-functional team collaboration, frequent customer feedback, and adaptive planning over rigid sequential phases.',
    examNote: 'Key principle: Working software over comprehensive documentation.',
  },
  {
    id: 2,
    term: 'Scrum Master',
    category: 'Agile Framework',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    definition: 'A servant-leader accountable for facilitating Scrum ceremonies, eliminating operational blockers, and shielding the development team from external mid-sprint scope changes.',
    examNote: 'Does not manage the team hierarchically; protects the sprint goal.',
  },
  {
    id: 3,
    term: 'CMM Level 3 (Defined)',
    category: 'Quality & Maturity',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    definition: 'The process maturity tier where software engineering and management processes are formally documented, standardized, and integrated into organization-wide standard operating procedures.',
    examNote: 'Distinction: Level 2 is repeatable at project level; Level 3 is standardized organization-wide.',
  },
  {
    id: 4,
    term: 'Waterfall Model',
    category: 'Process Models',
    badgeColor: 'bg-blue-100 text-brand-blue border-blue-200',
    definition: 'A classical linear-sequential lifecycle where progress flows strictly downwards through distinct phases: Requirements, Analysis, Design, Coding, Testing, and Maintenance.',
    examNote: 'High risk when requirements are volatile; late feedback loop.',
  },
  {
    id: 5,
    term: 'Software Deterioration',
    category: 'Software Nature',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    definition: 'Unlike hardware which undergoes physical wear-and-tear due to environmental friction, software deteriorates because successive unmanaged changes introduce unforeseen defects and side-effects.',
    examNote: 'Pressman core concept: Software does not wear out—it deteriorates.',
  },
  {
    id: 6,
    term: "Pressman's Wear Curve",
    category: 'Metrics & Curves',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    definition: 'Graph comparing idealized failure rate with actual software failure rate. Spikes occur every time new maintenance patches or requirement modifications inject new side-effect defects into the system.',
    examNote: 'Contrasts with the classic bathtub curve observed in hardware reliability.',
  },
  {
    id: 7,
    term: 'Sprint Retrospective',
    category: 'Agile Framework',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    definition: 'A timeboxed meeting conducted at the conclusion of every Sprint for the Scrum team to inspect people, relationships, processes, and tools, and enact targeted process improvements for the subsequent Sprint.',
    examNote: 'Focuses on team continuous improvement, not product demonstration.',
  },
  {
    id: 8,
    term: 'Verification vs Validation',
    category: 'Quality Assurance',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    definition: 'Verification evaluates intermediate work artifacts to ensure conformance to specifications ("Are we building the product right?"). Validation confirms whether the finished software satisfies user requirements ("Are we building the right product?").',
    examNote: 'Classic FTR viva question: Boehm criteria.',
  },
];

function FlashCard({ card, isFlipped, onToggle }) {
  return (
    <div
      onClick={() => onToggle(card.id)}
      className="perspective-1000 h-[280px] w-full cursor-pointer select-none group"
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ── FRONT FACE ── */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                {card.category}
              </span>
              <span className="text-xs font-mono font-medium text-slate-400">
                #{String(card.id).padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-2 group-hover:text-brand-blue transition-colors">
              {card.term}
            </h3>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
            <span className="flex items-center gap-1.5 font-medium">
              <span>↻</span> Click to reveal definition
            </span>
            <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                {card.term}
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                DEFINITION
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {card.definition}
            </p>
            {card.examNote && (
              <div className="mt-3 p-2.5 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[11px] text-amber-300 leading-tight">
                  <span className="font-semibold text-amber-200">Exam Note: </span>
                  {card.examNote}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span>↺</span> Click to return to term
            </span>
            <span className="text-emerald-400 text-xs font-semibold">Reviewed ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Flashcards() {
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Process Models', 'Agile Framework', 'Quality & Maturity', 'Software Nature', 'Metrics & Curves', 'Quality Assurance'];

  const handleToggle = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFlipAll = () => {
    const allFlipped = {};
    flashcardsData.forEach((card) => {
      allFlipped[card.id] = true;
    });
    setFlippedCards(allFlipped);
  };

  const handleResetAll = () => {
    setFlippedCards({});
  };

  const filteredCards = selectedCategory === 'All'
    ? flashcardsData
    : flashcardsData.filter((card) => card.category === selectedCategory);

  const flippedCount = Object.values(flippedCards).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Header & Navigation ── */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Module 1: Software Processes
            </span>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {flippedCount} / {flashcardsData.length} Flipped
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero / Overview ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-xl">
                🃏
              </span>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Module 1 Flashcards
              </h1>
            </div>
            <p className="text-slate-500 max-w-xl text-base">
              Interactive spaced-repetition cards covering foundational software engineering lifecycles, Agile ceremonies, and CMM maturity tiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFlipAll}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition shadow-sm"
            >
              Reveal All
            </button>
            <button
              onClick={handleResetAll}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition shadow-sm"
            >
              Reset Cards
            </button>
          </div>
        </div>

        {/* ── Category Filters ── */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <FlashCard
              key={card.id}
              card={card}
              isFlipped={!!flippedCards[card.id]}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
