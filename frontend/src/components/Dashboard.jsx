import { Link } from 'react-router-dom';

const navItems = [
  {
    to: '/live',
    icon: '⚡',
    iconBg: 'bg-blue-100',
    iconColor: 'text-brand-blue',
    title: 'Live Classroom',
    description: 'Launch the real-time polling engine. Push questions, collect answers, and watch participation unfold live.',
    badge: 'REAL-TIME',
    badgeBg: 'bg-blue-100 text-brand-blue',
  },
  {
    to: '/notes',
    icon: '📒',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    title: 'Module Notes',
    description: 'Consolidated lecture notes organized by module. Read, review, and revise at your own pace.',
    badge: 'STUDY',
    badgeBg: 'bg-amber-100 text-amber-600',
  },
  {
    to: '/flashcards',
    icon: '🃏',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Flashcards',
    description: 'Spaced-repetition flashcards to drill key concepts, definitions, and critical distinctions.',
    badge: 'PRACTICE',
    badgeBg: 'bg-purple-100 text-purple-600',
  },
  {
    to: '/pyqs',
    icon: '📝',
    iconBg: 'bg-green-100',
    iconColor: 'text-brand-green',
    title: 'Previous Year Questions',
    description: 'Past examination questions with model answers. Know exactly what the evaluators expect.',
    badge: 'EXAM PREP',
    badgeBg: 'bg-green-100 text-brand-green',
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            EduSync<span className="text-brand-blue">.</span>
          </h1>
          <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Content Hub</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Everything you need,<br />
          <span className="text-brand-blue">one place.</span>
        </h2>
        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
          Live polling, curated notes, exam-ready flashcards, and previous year questions — built for the way you actually study.
        </p>
      </section>

      {/* ── Navigation Cards ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 ${item.iconBg} ${item.iconColor} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">
                {item.description}
              </p>
              <div className="mt-6 text-brand-blue text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
