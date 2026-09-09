import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  BookOpen,
  TrendingUp,
  Building2,
  Sliders,
  Check,
  Flame,
  Award,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  Laptop,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Zap,
} from 'lucide-react';

// Custom hook for scroll-triggered motion animations
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Scroll listener for sticky nav elevation & top reading progress indicator
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section Motion Observers
  const [heroRef, heroVisible] = useScrollReveal(0.05);
  const [simulatorRef, simulatorVisible] = useScrollReveal(0.1);
  const [personasRef, personasVisible] = useScrollReveal(0.08);
  const [featuresRef, featuresVisible] = useScrollReveal(0.08);
  const [placementsRef, placementsVisible] = useScrollReveal(0.1);
  const [faqRef, faqVisible] = useScrollReveal(0.08);
  const [ctaRef, ctaVisible] = useScrollReveal(0.1);

  // Interactive Flagship Command Console Preview State
  const [heroPreviewTab, setHeroPreviewTab] = useState('overview');

  // Interactive Simulator State
  const [activeTab, setActiveTab] = useState('student');
  const [demoCgpa, setDemoCgpa] = useState(8.2);
  const [demoBacklogs, setDemoBacklogs] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick Persona Demo Navigation
  const handleLaunchPersona = (email, password) => {
    navigate(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  };

  const rolePersonas = [
    {
      id: 'superadmin',
      role: 'Super Admin',
      title: 'Global Control Plane',
      email: 'superadmin@campusflow.edu',
      password: 'Admin@123',
      badgeColor: 'from-purple-500 to-indigo-500',
      description: 'Provision new institutions, oversee cross-campus multi-tenancy, and inspect system-wide audit telemetry.',
      icon: Layers,
      highlight: 'Multi-Tenant Orchestration',
    },
    {
      id: 'campusadmin',
      role: 'Campus Admin',
      title: 'Anurag University Admin',
      email: 'admin@anurag.edu.in',
      password: 'Admin@123',
      badgeColor: 'from-indigo-500 to-blue-500',
      description: 'Manage CSE, ECE, & MECH departments, course accreditations, faculty rosters, and verify student requests.',
      icon: Building2,
      highlight: 'Institutional Governance',
    },
    {
      id: 'faculty',
      role: 'Faculty (CSE)',
      title: 'Dr. Alan Turing',
      email: 'faculty.cs@anurag.edu.in',
      password: 'Faculty@123',
      badgeColor: 'from-teal-500 to-emerald-500',
      description: '1-click classroom attendance sheets, assignment grading feedback, and automated AI student performance summaries.',
      icon: BookOpen,
      highlight: 'Classroom & Coursework Engine',
    },
    {
      id: 'student-safe',
      role: 'Student (High CGPA)',
      title: 'Rahul Sharma (23AUCS001)',
      email: 'student1@anurag.edu.in',
      password: 'Student@123',
      badgeColor: 'from-cyan-500 to-blue-500',
      description: 'CGPA 8.8, 90% attendance standing, automated 7-day AI study roadmaps, and 1-click placement drive applications.',
      icon: GraduationCap,
      highlight: 'Personalized AI & Career Hub',
    },
    {
      id: 'placement',
      role: 'Placement Officer',
      title: 'Marcus Brody',
      email: 'placement@anurag.edu.in',
      password: 'Placement@123',
      badgeColor: 'from-violet-500 to-purple-600',
      description: 'Publish recruiter drives (Google, MSFT), enforce server-side eligibility rules, schedule interview stages & record offers.',
      icon: Briefcase,
      highlight: 'Automated Recruitment Funnel',
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Deterministic AI Academic Assistant',
      description:
        'Zero-hallucination academic analysis. Synthesizes 7-day revision timetables and flags weak subjects using verified attendance and grade thresholds.',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      icon: ShieldCheck,
      title: 'Server-Enforced Placement Filtering',
      description:
        'Prevents unqualified applications on the backend. Strictly validates CGPA, active backlogs, and departmental eligibility before submission.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Automated 75% Attendance Guardrails',
      description:
        'Real-time calculation of present vs. total sessions per course with immediate critical alerts before semester detention thresholds are breached.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Laptop,
      title: 'End-to-End Coursework & Submissions',
      description:
        'Faculty issue coursework with deadlines and reference material; students upload solutions with timestamps and receive structured marks and critique.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Layers,
      title: 'Strict Multi-Tenant Scoping',
      description:
        'Guaranteed data isolation across universities and departments via compound MongoDB indices and cryptographic JWT tenant claims.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      title: 'Administrative Transparency & Audit',
      description:
        'Every sensitive action—from grade overrides to drive applications—is recorded in immutable audit logs with instant CSV exports.',
      gradient: 'from-rose-500 to-red-500',
    },
  ];

  const faqs = [
    {
      q: 'Which university is currently pre-configured on CampusFlow?',
      a: 'CampusFlow is configured for Anurag University (Hyderabad, Telangana) with pre-seeded departments (Computer Science, Electronics, Mechanical), registered faculty members, active semester coursework, and enrolled student cohorts.',
    },
    {
      q: 'How does the AI Study Assistant work without requiring paid API keys?',
      a: 'CampusFlow features a hybrid AI architecture. If an AI_API_KEY (Google Gemini) is provided, it enriches the advice with natural language generation. If omitted, it automatically engages an intelligent deterministic rules engine that analyzes actual student database metrics to formulate accredited revision timetables without crashing or hallucinating.',
    },
    {
      q: 'How does the placement module ensure only eligible students apply?',
      a: 'Eligibility checks are strictly enforced on the server within the placementController. Even if a user attempts to bypass the client UI, the backend evaluates their live CGPA, backlog count, and department against the job drive criteria, rejecting invalid applications with an explanatory error.',
    },
    {
      q: 'Can multiple colleges use the same CampusFlow deployment simultaneously?',
      a: 'Yes. CampusFlow is architected with complete multi-tenancy. All collections—Users, Courses, Subjects, Attendance, Placements—are scoped by institutionId. The Super Administrator can provision and oversee multiple independent universities on a single instance.',
    },
  ];

  // Live simulation helpers
  const isEligibleForGoogle = demoCgpa >= 8.5 && demoBacklogs === 0;
  const isEligibleForAmazon = demoCgpa >= 7.5 && demoBacklogs === 0;
  const isEligibleForInfosys = demoCgpa >= 6.0 && demoBacklogs <= 1;

  return (
    <div className="min-h-screen bg-space-cobalt text-white font-sans selection:bg-orange-500/30 selection:text-orange-200 relative overflow-x-hidden">
      {/* Top Reading Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#ff6b00] via-[#ff8800] to-[#ffa133] z-[100] transition-all duration-75 shadow-sm shadow-orange-500/50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Ambient Lighting Mesh Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-500/25 via-indigo-600/15 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-[-150px] w-[500px] h-[500px] bg-blue-600/15 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1200px] right-[-150px] w-[600px] h-[600px] bg-orange-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Top Glassmorphic Navigation with Scroll Motion */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#0e1450]/92 border-b border-white/15 shadow-2xl shadow-blue-950/60 py-0.5'
            : 'bg-[#141b68]/70 border-b border-white/10 py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6b00] to-[#ffa133] p-[1.5px] shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-2 transition-all">
                <div className="w-full h-full bg-[#0e1450] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-orange-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-orange-300 transition-colors">
                    CampusFlow
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                    AU
                  </span>
                </div>
                <span className="text-[10px] text-blue-200/80 tracking-wider block">Anurag University OS</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-blue-100/90">
              <a href="#simulator" className="hover:text-white transition-colors relative group py-1">
                <span>Interactive Preview</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b00] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
              <a href="#personas" className="hover:text-white transition-colors relative group py-1">
                <span>Role Portals</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b00] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
              <a href="#features" className="hover:text-white transition-colors relative group py-1">
                <span>Features</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b00] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
              <a href="#placements" className="hover:text-white transition-colors relative group py-1">
                <span>Placement Hub</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b00] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
              <a href="#faq" className="hover:text-white transition-colors relative group py-1">
                <span>FAQ</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff6b00] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white btn-vivid-orange rounded-xl cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-semibold text-blue-100 hover:text-white rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 transition-all"
                  >
                    Sign In
                  </Link>
                  <a
                    href="#personas"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white btn-vivid-orange rounded-xl cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Try Demo Portals</span>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-4 bg-[#0e1450]/98 border-b border-white/15 space-y-2">
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-blue-100 hover:text-white"
            >
              Interactive Preview
            </a>
            <a
              href="#personas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-blue-100 hover:text-white"
            >
              Role Portals
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-blue-100 hover:text-white"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-blue-100 hover:text-white"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 text-xs font-bold text-white btn-vivid-orange rounded-xl shadow-md"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl"
                >
                  Sign In to Portal
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Parallax & Floating Motion Elements */}
      <section ref={heroRef} className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Floating Decorative Badges with Gentle Physics */}
        <div className="hidden lg:flex absolute top-28 left-6 xl:left-12 items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0f154d]/85 border border-white/15 backdrop-blur-xl shadow-2xl shadow-blue-950/60 animate-float-slow z-20 pointer-events-none">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-blue-200/80 uppercase font-bold tracking-wider block">Real-Time Sync</span>
            <span className="text-xs font-bold text-white">98.4% Attendance Accuracy</span>
          </div>
        </div>

        <div className="hidden lg:flex absolute top-36 right-6 xl:right-12 items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0f154d]/85 border border-white/15 backdrop-blur-xl shadow-2xl shadow-blue-950/60 animate-float-delayed z-20 pointer-events-none">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-blue-200/80 uppercase font-bold tracking-wider block">Top CTC Drive</span>
            <span className="text-xs font-bold text-white">45 LPA • Google / Microsoft</span>
          </div>
        </div>

        <div className="hidden xl:flex absolute bottom-16 left-20 items-center gap-3 px-4 py-2 rounded-2xl bg-[#0f154d]/85 border border-white/15 backdrop-blur-xl shadow-2xl shadow-blue-950/60 animate-float z-20 pointer-events-none">
          <div className="w-7 h-7 rounded-xl bg-white/10 text-orange-400 border border-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white">Zero-Hallucination AI Engine</span>
          </div>
        </div>

        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-700 transform ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-white mb-6 shadow-xs backdrop-blur-md animate-bounce-slow">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>Enterprise Multi-Tenant College OS • Anurag University Edition</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            The Intelligent Operating System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-orange-400">
              Modern Higher Education
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-blue-100/85 max-w-2xl mx-auto leading-relaxed font-normal">
            A unified full-stack MERN platform uniting Anurag University students, faculty, administrators, and corporate recruiters with AI academic diagnostics, real-time attendance guardrails, and automated job drive funnels.
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#simulator"
              className="px-6 py-3.5 text-xs sm:text-sm font-bold text-white btn-vivid-orange rounded-xl flex items-center gap-2 cursor-pointer group"
            >
              <span>Explore Interactive Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#personas"
              className="px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl hover:-translate-y-1 transition-all flex items-center gap-2 backdrop-blur-md shadow-sm hover:border-white/40"
            >
              <Users className="w-4 h-4 text-orange-400" />
              <span>Launch 1-Click Role Portals</span>
            </a>
          </div>

          {/* Live Metrics Ticker with Staggered Scroll-Reveal & Hover Lift */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {[
              { val: '98.4%', label: 'Attendance Accuracy', color: 'text-white' },
              { val: '15+', label: 'Active Campus Drives', color: 'text-orange-400' },
              { val: '45 LPA', label: 'Top CTC Offered', color: 'text-white' },
              { val: '100%', label: 'Server Eligibility Guard', color: 'text-orange-400' },
            ].map((m, idx) => (
              <div
                key={m.label}
                className={`p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20 ${
                  heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className={`block text-2xl font-extrabold ${m.color}`}>{m.val}</span>
                <span className="text-[11px] font-semibold text-blue-200/80">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Flagship Interactive Glass Command Console Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-white/20 via-white/10 to-white/5 border border-white/20 shadow-2xl shadow-blue-950/80 backdrop-blur-2xl">
            <div className="rounded-[22px] bg-[#0c1244]/95 border border-white/15 overflow-hidden text-left shadow-2xl">
              {/* Console Window Header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#131a64]/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#090d34] border border-white/10 text-[11px] text-blue-200/80 font-mono">
                    <span className="text-emerald-400">●</span>
                    <span className="text-white font-bold">au.campusflow.edu</span>
                    <span className="text-blue-300/60">/workspace/live-session</span>
                  </div>
                </div>

                {/* Interactive Console Navigation Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090d34]/90 border border-white/10 text-[11px] font-semibold">
                  {[
                    { id: 'overview', label: 'Campus Overview' },
                    { id: 'study', label: 'AI Study Hub' },
                    { id: 'placements', label: 'Placement Funnel' },
                    { id: 'attendance', label: 'Biometrics Guard' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setHeroPreviewTab(t.id)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        heroPreviewTab === t.id
                          ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-sm shadow-orange-500/30 font-bold'
                          : 'text-blue-200/80 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Console Window Body */}
              <div className="p-5 sm:p-7">
                {heroPreviewTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase font-bold text-blue-200/70 block">Overall Standing</span>
                        <span className="text-xl font-extrabold text-emerald-400">89.4%</span>
                        <span className="text-[10px] text-blue-200/60 block">Attendance Safe</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase font-bold text-blue-200/70 block">Cumulative GPA</span>
                        <span className="text-xl font-extrabold text-white">8.82</span>
                        <span className="text-[10px] text-blue-200/60 block">Top 5% Cohort</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase font-bold text-blue-200/70 block">Eligible Drives</span>
                        <span className="text-xl font-extrabold text-orange-400">12 Offers</span>
                        <span className="text-[10px] text-blue-200/60 block">Google, MSFT, AWS</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] uppercase font-bold text-blue-200/70 block">System Verification</span>
                        <span className="text-xl font-extrabold text-white">Active</span>
                        <span className="text-[10px] text-blue-200/60 block">Zero-Trust JWT</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                            <span>Today's Academic Schedule</span>
                          </span>
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Semester 6 CSE</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2 rounded-lg bg-[#090d34]/60 border border-white/10 flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-white block">Distributed Cloud Systems</span>
                              <span className="text-[10px] text-blue-200/70">Dr. Alan Turing • Hall 204</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">PRESENT</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#090d34]/60 border border-white/10 flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-white block">Full-Stack Lab Practicum</span>
                              <span className="text-[10px] text-blue-200/70">Lab CSE-3 • In Progress</span>
                            </div>
                            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded animate-pulse">LIVE</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                            <span>Live Campus Activity Feed</span>
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>Syncing</span>
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2 rounded-lg bg-[#090d34]/60 border border-white/10 flex justify-between items-center">
                            <span className="text-blue-100 truncate">Microsoft SWE Drive interview slots released</span>
                            <span className="text-[10px] text-blue-300/60 font-mono">10m ago</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#090d34]/60 border border-white/10 flex justify-between items-center">
                            <span className="text-blue-100 truncate">AI generated 7-day revision roadmap for Algorithms</span>
                            <span className="text-[10px] text-blue-300/60 font-mono">25m ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {heroPreviewTab === 'study' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/10 border border-orange-500/30 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Hybrid Deterministic AI Revision Engine</h4>
                        <p className="text-[11px] text-blue-100/80">
                          Formulates custom 7-day study roadmaps based on attendance deficits and mid-term exam weighting.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold text-orange-400 block mb-1">Day 1-2 • Priority 1</span>
                        <span className="font-bold text-white block">Dynamic Programming</span>
                        <span className="text-[10px] text-blue-200/70 block mt-1">Weighted 28% of Final Exam</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold text-white block mb-1">Day 3-4 • Priority 2</span>
                        <span className="font-bold text-white block">Graph Algorithms & Trees</span>
                        <span className="text-[10px] text-blue-200/70 block mt-1">BFS/DFS, Dijkstra Pathing</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold text-emerald-400 block mb-1">Day 5-7 • Mock Tests</span>
                        <span className="font-bold text-white block">Full Lab Exam Simulation</span>
                        <span className="text-[10px] text-blue-200/70 block mt-1">Timed Code Submissions</span>
                      </div>
                    </div>
                  </div>
                )}

                {heroPreviewTab === 'placements' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-white text-xs">Google SWE</span>
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">42 LPA</span>
                        </div>
                        <span className="text-[11px] text-blue-200/80 block">Criteria: CGPA ≥ 8.5 • 0 Backlogs</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Eligible on Server
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-white text-xs">Microsoft Azure</span>
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">38 LPA</span>
                        </div>
                        <span className="text-[11px] text-blue-200/80 block">Criteria: CGPA ≥ 8.0 • 0 Backlogs</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Eligible on Server
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-white text-xs">Amazon AWS</span>
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">28 LPA</span>
                        </div>
                        <span className="text-[11px] text-blue-200/80 block">Criteria: CGPA ≥ 7.5 • 0 Backlogs</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Eligible on Server
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {heroPreviewTab === 'attendance' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">75% Mandatory Attendance Regulatory Guard</span>
                        <span className="text-[11px] text-blue-200/80 block mt-0.5">
                          Autonomous institutions mandate 75% for hall-ticket eligibility. The server enforces instant warnings at 76%.
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-emerald-400">89.4%</span>
                          <span className="text-[10px] text-blue-200/70 block font-semibold">Safe Standing</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-white">
                          89%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Institutional Accreditation & Enterprise Trust Strip */}
          <div className="mt-16 pt-10 border-t border-white/10 max-w-6xl mx-auto">
            <p className="text-[11px] font-bold text-blue-200/80 uppercase tracking-widest text-center mb-6">
              Accredited Institutional Framework • Built for Autonomous Universities
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-orange-500/40 transition-colors">
                <span className="block text-xs font-black text-orange-400">NAAC A+</span>
                <span className="text-[10px] text-blue-200/80 font-semibold">Autonomous Grade</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-orange-500/40 transition-colors">
                <span className="block text-xs font-black text-white">NBA Accredited</span>
                <span className="text-[10px] text-blue-200/80 font-semibold">CSE, ECE, MECH</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-orange-500/40 transition-colors">
                <span className="block text-xs font-black text-orange-300">AICTE Approved</span>
                <span className="text-[10px] text-blue-200/80 font-semibold">Technical Standard</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-orange-500/40 transition-colors">
                <span className="block text-xs font-black text-white">NIRF Ranked</span>
                <span className="text-[10px] text-blue-200/80 font-semibold">Top Tier Category</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-orange-500/40 transition-colors">
                <span className="block text-xs font-black text-orange-400 font-bold">Anurag University</span>
                <span className="text-[10px] text-blue-200/80 font-semibold">Code: AU Hyderabad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section with Scroll Motion */}
      <section id="simulator" ref={simulatorRef} className="py-16 md:py-24 bg-[#0e1450]/40 border-y border-white/10 relative">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 transform ${
            simulatorVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
          }`}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5 animate-pulse-slow">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Live Preview</span>
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience the Platform Across Every Role
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-blue-200/80">
              Click the tabs below to test live interactive simulator widgets for students, faculty, recruiters, and campus administrators.
            </p>

            {/* Interactive Tab Switcher (2x2 on mobile, inline pill bar on desktop) */}
            <div className="mt-8 grid grid-cols-2 sm:inline-flex p-1.5 rounded-2xl bg-[#0a0e38]/90 border border-white/10 gap-1.5 shadow-inner w-full sm:w-auto max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-md shadow-orange-500/30'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Hub</span>
              </button>
              <button
                onClick={() => setActiveTab('faculty')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-md shadow-orange-500/30'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Faculty Suite</span>
              </button>
              <button
                onClick={() => setActiveTab('placement')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'placement'
                    ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-md shadow-orange-500/30'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Placement Funnel</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-md shadow-orange-500/30'
                    : 'text-blue-200/80 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Governance</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Student Interactive Simulator */}
          {activeTab === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Card 1: Attendance Dial */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-white">Attendance Standing</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Safe Zone
                  </span>
                </div>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-500/10">
                    <div className="text-center">
                      <span className="text-2xl font-black text-white">88.5%</span>
                      <span className="text-[10px] text-blue-200/70 block">Overall</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="flex justify-between text-blue-100">
                    <span>DBMS (CS401)</span>
                    <span className="font-semibold text-emerald-400">92%</span>
                  </div>
                  <div className="flex justify-between text-blue-100">
                    <span>Computer Networks (CS403)</span>
                    <span className="font-semibold text-emerald-400">85%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Study Schedule */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3 text-orange-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Study Plan (7 Days)</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Automated Revision Roadmap</h4>
                <div className="space-y-2 text-[11px] text-blue-100">
                  <div className="p-2 rounded-xl bg-[#090d34]/60 border border-white/10 flex items-center justify-between">
                    <span>Mon: Relational Normalization (1NF-BCNF)</span>
                    <span className="text-orange-400 font-bold">1.5 hrs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#090d34]/60 border border-white/10 flex items-center justify-between">
                    <span>Tue: TCP Flow & Congestion Control</span>
                    <span className="text-orange-400 font-bold">2.0 hrs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#090d34]/60 border border-white/10 flex items-center justify-between">
                    <span>Wed: Virtual Memory & Page Faults</span>
                    <span className="text-orange-400 font-bold">1.5 hrs</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-blue-200/70">Weak Area Flagged:</span>
                  <span className="font-bold text-orange-400">Operating Systems (62%)</span>
                </div>
              </div>

              {/* Card 3: Semester CGPA & Coursework */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-white">Academic Standing</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                      Top 5%
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#090d34]/60 border border-white/10 mb-3">
                    <span className="text-xs text-blue-200/70">Cumulative GPA:</span>
                    <span className="block text-3xl font-black text-white">8.80 / 10.0</span>
                  </div>
                  <div className="text-xs text-blue-200/80 space-y-1">
                    <p>• Department: Computer Science (B.Tech)</p>
                    <p>• Semester: 4th Semester (Active)</p>
                    <p>• Active Backlogs: 0</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchPersona('student1@anurag.edu.in', 'Student@123')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white btn-vivid-orange transition-colors cursor-pointer"
                >
                  Open Rahul's Student Portal →
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Faculty Interactive Simulator */}
          {activeTab === 'faculty' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Classroom Sheet */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Database Management Systems (CS401)</h4>
                    <p className="text-[11px] text-blue-200/70">Class Attendance Sheet • 4th Semester CSE</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20">
                    Live Session
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#090d34]/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Rahul Sharma</span>
                      <span className="text-[10px] text-blue-200/70">23AUCS001</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PRESENT
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090d34]/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Priya Patel</span>
                      <span className="text-[10px] text-blue-200/70">23AUCS002</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PRESENT
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090d34]/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Amit Kumar</span>
                      <span className="text-[10px] text-blue-200/70">23AUCS003</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      ABSENT (ALERT)
                    </span>
                  </div>
                </div>
              </div>

              {/* Faculty Tools */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Faculty Diagnostics</h4>
                  <div className="space-y-3 text-xs text-blue-100">
                    <div className="p-3 rounded-xl bg-[#090d34]/60 border border-white/10">
                      <span className="font-semibold text-white block mb-1">AI Student Synthesizer</span>
                      <p className="text-[11px] text-blue-200/70">
                        Generate comprehensive executive summaries on any student's performance with 1 click.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#090d34]/60 border border-white/10">
                      <span className="font-semibold text-white block mb-1">Coursework Review Drawer</span>
                      <p className="text-[11px] text-blue-200/70">
                        Review uploaded assignment submissions, verify timestamps, and return rubric grades.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchPersona('faculty.cs@anurag.edu.in', 'Faculty@123')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white btn-vivid-orange transition-colors cursor-pointer"
                >
                  Launch Dr. Turing's Console →
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Placement Interactive Simulator */}
          {activeTab === 'placement' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Interactive Eligibility Slider */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                  Test Server-Side Eligibility Engine
                </h4>
                <p className="text-[11px] text-blue-200/80 mb-4">
                  Adjust student credentials to see automated qualification against corporate drive criteria:
                </p>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-blue-100 mb-1">
                      <span>Simulated CGPA:</span>
                      <span className="font-bold text-orange-400">{demoCgpa.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="10.0"
                      step="0.1"
                      value={demoCgpa}
                      onChange={(e) => setDemoCgpa(parseFloat(e.target.value))}
                      className="w-full accent-[#ff6b00] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-blue-100 mb-1">
                      <span>Active Backlogs:</span>
                      <span className="font-bold text-rose-400">{demoBacklogs}</span>
                    </div>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((b) => (
                        <button
                          key={b}
                          onClick={() => setDemoBacklogs(b)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            demoBacklogs === b
                              ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-xs'
                              : 'bg-[#090d34] border border-white/10 text-blue-200/80 hover:text-white'
                          }`}
                        >
                          {b} Backlog{b !== 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Drives Match Matrix */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h4 className="text-xs font-bold text-blue-200/80 uppercase tracking-wider mb-3">
                  Live Drive Eligibility Qualification
                </h4>
                <div className="space-y-2.5 text-xs">
                  {/* Google */}
                  <div className="p-3 rounded-xl bg-[#090d34]/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">Google</span>
                        <span className="text-[10px] text-blue-200/70">Software Engineer III • 42 LPA</span>
                      </div>
                      <span className="text-[10px] text-blue-300/60 block mt-0.5">Requires CGPA ≥ 8.5 & 0 Backlogs</span>
                    </div>
                    {isEligibleForGoogle ? (
                      <span className="self-start sm:self-auto flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ELIGIBLE</span>
                      </span>
                    ) : (
                      <span className="self-start sm:self-auto flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>INELIGIBLE</span>
                      </span>
                    )}
                  </div>

                  {/* Amazon */}
                  <div className="p-3 rounded-xl bg-[#090d34]/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">Amazon AWS</span>
                        <span className="text-[10px] text-blue-200/70">Cloud Development Associate • 28 LPA</span>
                      </div>
                      <span className="text-[10px] text-blue-300/60 block mt-0.5">Requires CGPA ≥ 7.5 & 0 Backlogs</span>
                    </div>
                    {isEligibleForAmazon ? (
                      <span className="self-start sm:self-auto flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ELIGIBLE</span>
                      </span>
                    ) : (
                      <span className="self-start sm:self-auto flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>INELIGIBLE</span>
                      </span>
                    )}
                  </div>

                  {/* Infosys */}
                  <div className="p-3 rounded-xl bg-[#090d34]/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">Infosys Ltd</span>
                        <span className="text-[10px] text-blue-200/70">Specialist Programmer • 9.5 LPA</span>
                      </div>
                      <span className="text-[10px] text-blue-300/60 block mt-0.5">Requires CGPA ≥ 6.0 & ≤ 1 Backlog</span>
                    </div>
                    {isEligibleForInfosys ? (
                      <span className="self-start sm:self-auto flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ELIGIBLE</span>
                      </span>
                    ) : (
                      <span className="self-start sm:self-auto flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>INELIGIBLE</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Governance Interactive Simulator */}
          {activeTab === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Departmental Structure</h4>
                <div className="space-y-2 mt-3 text-xs">
                  <div className="p-2 rounded-xl bg-[#090d34]/60 border border-white/10 flex justify-between">
                    <span className="font-semibold text-white">Computer Science (CSE)</span>
                    <span className="text-orange-400 font-bold">4 Faculty • 8 Students</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#090d34]/60 border border-white/10 flex justify-between">
                    <span className="font-semibold text-white">Electronics (ECE)</span>
                    <span className="text-orange-400 font-bold">1 Faculty • 1 Student</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#090d34]/60 border border-white/10 flex justify-between">
                    <span className="font-semibold text-white">Mechanical (MECH)</span>
                    <span className="text-orange-400 font-bold">1 Faculty • 1 Student</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Pending Approvals Queue (Anurag University)
                    </h4>
                    <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      2 Needs Review
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#090d34]/80 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Bonafide Certificate Request</span>
                        <span className="text-[10px] text-blue-200/70">By Rahul Sharma • For Passport Application</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300">
                        PENDING
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#090d34]/80 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Medical Leave Sanction</span>
                        <span className="text-[10px] text-blue-200/70">By Amit Kumar • 3 Days with Doctor Slip</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300">
                        PENDING
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchPersona('admin@anurag.edu.in', 'Admin@123')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white btn-vivid-orange transition-colors cursor-pointer"
                >
                  Enter Campus Administrator Workspace →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5-Role Interactive Portal Selector with Scroll Motion */}
      <section id="personas" ref={personasRef} className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 transform ${
            personasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-orange-400 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 animate-pulse-slow">
            <Users className="w-3.5 h-3.5" />
            <span>Role-Based Command Centers</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Launch Any Persona with 1-Click
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-blue-200/80">
            Click any demo portal card below to jump straight to the Sign-In console with pre-filled credentials for instant evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolePersonas.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/60 transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/15 group transform ${
                  personasVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.badgeColor} p-2 flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#090d34] border border-white/10 text-blue-200/90">
                      {p.highlight}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors">
                    {p.role}
                  </h4>
                  <span className="text-xs font-semibold text-blue-200/70 block mb-2">{p.title}</span>
                  <p className="text-xs text-blue-100/80 leading-relaxed mb-4">{p.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-blue-200/60 mb-3 font-mono">
                    <span>{p.email}</span>
                  </div>
                  <button
                    onClick={() => handleLaunchPersona(p.email, p.password)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-gradient-to-r hover:from-[#ff6b00] hover:to-[#ff8800] border border-white/15 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Launch {p.role} Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architectural Bento Grid with Scroll Motion */}
      <section id="features" ref={featuresRef} className="py-20 md:py-28 bg-[#0e1450]/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 transform ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-orange-400 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 animate-pulse-slow">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture & Bento Layout</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Precision, Zero Hallucinations
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-blue-200/80">
              Built on production-grade MERN primitives with multi-tenant MongoDB isolation, deterministic rule engines, and sub-millisecond cryptographic JWT authorization.
            </p>
          </div>

          {/* High-End Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento 1: Large 2-Col AI Study Engine */}
            <div
              className={`lg:col-span-2 p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-500 group flex flex-col justify-between hover:shadow-2xl hover:shadow-orange-500/15 transform ${
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ffa133] p-2.5 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Dual Hybrid AI Engine
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  Deterministic Study Diagnostics & AI Roadmaps
                </h4>
                <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-xl">
                  Connects live student course enrollments with historical syllabus exam weighting. If Gemini API credentials are omitted, it automatically falls back to an intelligent mathematical rules engine that formulates accredited 7-day revision plans without hallucinations.
                </p>
              </div>

              {/* Interactive Mock Prompt Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-[#090d34]/90 border border-white/10 text-xs font-mono">
                <div className="flex items-center justify-between text-blue-200/70 pb-2 border-b border-white/10 text-[11px]">
                  <span>AI Request: Study Roadmap • CSE Semester 6</span>
                  <span className="text-emerald-400 font-bold">200 OK • 18ms</span>
                </div>
                <div className="pt-3 space-y-1.5 text-blue-100 text-[11px]">
                  <p className="text-orange-400 font-semibold">→ Primary Focus: Dynamic Programming & Binary Search Trees (28% marks)</p>
                  <p className="text-white font-semibold">→ Secondary Focus: Cloud Distributed Transaction Isolation (22% marks)</p>
                  <p className="text-blue-200/80">→ Scheduled Practice: 3 Timed Lab Coding Challenges</p>
                </div>
              </div>
            </div>

            {/* Bento 2: 75% Attendance Guardrail */}
            <div
              className={`p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 group flex flex-col justify-between hover:shadow-2xl hover:shadow-emerald-500/15 transform ${
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  75% Attendance Regulatory Guard
                </h4>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Autonomous university regulations mandate a minimum of 75% attendance for examination eligibility. Real-time notifications alert students when attendance drops under 76%.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#090d34]/90 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Threshold Monitor</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Safe Standing: 89.4%</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-bold text-xs text-white">
                  ✓
                </div>
              </div>
            </div>

            {/* Bento 3: Server-Side Placement Engine */}
            <div
              className={`p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-500 group flex flex-col justify-between hover:shadow-2xl hover:shadow-orange-500/15 transform ${
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ff8800] p-2.5 flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  Deterministic Server Placement Guard
                </h4>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Even if a visitor tampers with the frontend client, the backend placementController enforces strict database-level checks on live CGPA and backlogs before recording any application.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#090d34]/90 border border-white/10 space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-blue-100">
                  <span>Google SWE (CGPA ≥ 8.5):</span>
                  <span className="text-emerald-400 font-bold">ALLOWED</span>
                </div>
                <div className="flex justify-between items-center text-blue-100">
                  <span>Backlogs Allowed:</span>
                  <span className="text-rose-400 font-bold">0 MAX</span>
                </div>
              </div>
            </div>

            {/* Bento 4: Large 2-Col Multi-Tenant Isolation */}
            <div
              className={`lg:col-span-2 p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 group flex flex-col justify-between hover:shadow-2xl transform ${
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 p-2.5 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
                    Enterprise Multi-Tenancy
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  Institutional Scoping & Cross-Campus Scalability
                </h4>
                <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-xl">
                  Every user, department, course, subject, attendance log, and job drive is indexed and partitioned by institutional boundaries. A single CampusFlow cluster can power multiple autonomous colleges with zero cross-tenant data leakage.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-[#090d34]/90 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="font-semibold text-white">Anurag University (Code AU)</span>
                </div>
                <span className="text-[11px] text-blue-200/70 font-mono">Scoped Collections: 14 • Isolated DB Indexing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Hub with Interactive Screener */}
      <section id="placements" ref={placementsRef} className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#171f78] via-[#121858] to-[#0e1450] border border-white/15 hover:border-orange-500/50 shadow-2xl shadow-blue-950/80 relative overflow-hidden transition-all duration-700 transform ${
            placementsVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.96] translate-y-12'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column Description */}
            <div className="lg:col-span-6">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-2 block">
                Corporate Recruitment Engine
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                Connected with Industry Leaders & Global Tech Giants
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                CampusFlow automates the entire recruitment lifecycle for Anurag University students—from dynamic criteria screening to multi-stage interview scheduling and offer letter verification.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-semibold text-white">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d34]/70 border border-white/10">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google (42 LPA)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d34]/70 border border-white/10">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Microsoft (38 LPA)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d34]/70 border border-white/10">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Amazon AWS (28 LPA)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d34]/70 border border-white/10">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TCS Digital (9.5 LPA)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Placement Eligibility Screener */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0a0e38]/95 border border-white/15 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Live Eligibility Screener Sandbox
                </span>
                <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Dynamic Server Evaluation
                </span>
              </div>

              <div className="space-y-4 mt-5">
                {/* CGPA Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-blue-100">Your Current CGPA:</span>
                    <span className="text-orange-400 font-bold">{demoCgpa.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={demoCgpa}
                    onChange={(e) => setDemoCgpa(parseFloat(e.target.value))}
                    className="w-full accent-[#ff6b00] h-1.5 bg-[#121858] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Backlogs Selector */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-blue-100">Active Backlogs:</span>
                    <span className="text-white font-bold">{demoBacklogs} Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((b) => (
                      <button
                        key={b}
                        onClick={() => setDemoBacklogs(b)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          demoBacklogs === b
                            ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff8800] text-white shadow-xs'
                            : 'bg-[#090d34] text-blue-200/80 hover:text-white border border-white/10'
                        }`}
                      >
                        {b === 2 ? '2+ Backlogs' : `${b} Backlog`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Real-Time Drive Unlocks */}
                <div className="pt-2 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Google Software Engineer (42 LPA)</span>
                      <span className="text-[10px] text-blue-200/70">Min CGPA 8.5 • 0 Backlogs</span>
                    </div>
                    {isEligibleForGoogle ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ELIGIBLE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        INELIGIBLE
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Microsoft Azure Core (38 LPA)</span>
                      <span className="text-[10px] text-blue-200/70">Min CGPA 8.0 • 0 Backlogs</span>
                    </div>
                    {demoCgpa >= 8.0 && demoBacklogs === 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ELIGIBLE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        INELIGIBLE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section with Staggered Cascades */}
      <section id="faq" ref={faqRef} className="py-20 md:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 transform ${
            faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-orange-400 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 animate-pulse-slow">
            <Zap className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Questions & Architecture Details</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/40 overflow-hidden transition-all duration-500 transform ${
                faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-orange-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-orange-400' : 'text-blue-200/80'
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-blue-100/85 leading-relaxed border-t border-white/10 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action with Scroll Motion */}
      <section ref={ctaRef} className="py-20 border-t border-white/10 bg-[#0c1244] text-center relative overflow-hidden">
        <div
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 transform ${
            ctaVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
          }`}
        >
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Explore CampusFlow?
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-blue-200/80 max-w-xl mx-auto">
            Log in to your institutional workspace or test any role in under 10 seconds.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-white btn-vivid-orange rounded-xl shadow-lg cursor-pointer"
            >
              Sign In to Your Workspace
            </Link>
            <a
              href="#personas"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all"
            >
              Select Demo Persona
            </a>
          </div>
        </div>
      </section>

      {/* Enterprise Multi-Column Footer */}
      <footer className="py-14 bg-[#080d32] border-t border-white/10 text-xs text-blue-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand & University Info */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff6b00] to-[#ffa133] flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/25">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-base font-extrabold text-white">CampusFlow OS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">
                  AU Hyderabad
                </span>
              </div>
              <p className="text-xs text-blue-200/70 leading-relaxed max-w-sm">
                Unified institutional operating platform engineered for Anurag University. Integrating academic tracking, AI revision assistance, biometric attendance guardrails, and automated job drive funnels.
              </p>
              <div className="text-[11px] text-blue-300/60">
                Venkatapur, Ghatkesar, Medchal-Malkajgiri district, Hyderabad, Telangana 500088
              </div>
            </div>

            {/* Col 2: Institutional Portals */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Portals</span>
              <ul className="space-y-1.5 text-blue-200/75 text-xs">
                <li><a href="#personas" className="hover:text-orange-400 transition-colors">Super Administrator</a></li>
                <li><a href="#personas" className="hover:text-orange-400 transition-colors">Campus Administrator</a></li>
                <li><a href="#personas" className="hover:text-orange-400 transition-colors">Faculty Suite</a></li>
                <li><a href="#personas" className="hover:text-orange-400 transition-colors">Student Workstation</a></li>
                <li><a href="#personas" className="hover:text-orange-400 transition-colors">Placement Officer</a></li>
              </ul>
            </div>

            {/* Col 3: Core Modules */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Modules</span>
              <ul className="space-y-1.5 text-blue-200/75 text-xs">
                <li><a href="#simulator" className="hover:text-orange-400 transition-colors">Attendance Guardrail</a></li>
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Deterministic AI Engine</a></li>
                <li><a href="#placements" className="hover:text-orange-400 transition-colors">Corporate Placement Hub</a></li>
                <li><a href="#simulator" className="hover:text-orange-400 transition-colors">Department Governance</a></li>
                <li><a href="#features" className="hover:text-orange-400 transition-colors">Audit Telemetry</a></li>
              </ul>
            </div>

            {/* Col 4: Accreditations */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Accreditations</span>
              <ul className="space-y-1.5 text-blue-200/75 text-xs">
                <li><span className="text-orange-400 font-semibold">NAAC A+ Grade</span></li>
                <li><span className="text-white font-semibold">NBA Accredited (CSE/ECE)</span></li>
                <li><span className="text-orange-300 font-semibold">AICTE Approved</span></li>
                <li><span className="text-white font-semibold">UGC Autonomous</span></li>
                <li><span className="text-orange-400 font-semibold">NIRF Tier 1 Ranked</span></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Strip */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-blue-300/60 text-[11px]">
            <div>
              © 2026 CampusFlow OS • Anurag University. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Services Online
              </span>
              <span>•</span>
              <span>MERN Stack Production Release</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
