import React, { useState } from 'react';
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
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-300 relative overflow-x-hidden">
      {/* Ambient Lighting Mesh Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] left-[-150px] w-[500px] h-[500px] bg-cyan-600/10 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1200px] right-[-150px] w-[600px] h-[600px] bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Top Glassmorphic Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">CampusFlow</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AU
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider block">Anurag University OS</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
              <a href="#simulator" className="hover:text-white transition-colors">
                Interactive Preview
              </a>
              <a href="#personas" className="hover:text-white transition-colors">
                Role Portals
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#placements" className="hover:text-white transition-colors">
                Placement Hub
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-xl hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                  >
                    Sign In
                  </Link>
                  <a
                    href="#personas"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-xl hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Try Demo Portals</span>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-4 bg-slate-950/95 border-b border-slate-800 space-y-2">
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-slate-300"
            >
              Interactive Preview
            </a>
            <a
              href="#personas"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-slate-300"
            >
              Role Portals
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-slate-300"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-semibold text-slate-300"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl shadow-md"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl"
                >
                  Sign In to Portal
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 mb-6 shadow-xs backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Enterprise Multi-Tenant College OS • Anurag University Edition</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            The Intelligent Operating System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400">
              Modern Higher Education
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            A unified full-stack MERN platform uniting Anurag University students, faculty, administrators, and corporate recruiters with AI academic diagnostics, real-time attendance guardrails, and automated job drive funnels.
          </p>

          {/* CTA Group */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#simulator"
              className="px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-xl hover:brightness-110 shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Interactive Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#personas"
              className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Launch 1-Click Role Portals</span>
            </a>
          </div>

          {/* Live Metrics Ticker */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl font-extrabold text-indigo-400">98.4%</span>
              <span className="text-[11px] font-semibold text-slate-400">Attendance Accuracy</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl font-extrabold text-cyan-400">15+</span>
              <span className="text-[11px] font-semibold text-slate-400">Active Campus Drives</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl font-extrabold text-emerald-400">45 LPA</span>
              <span className="text-[11px] font-semibold text-slate-400">Top CTC Offered</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
              <span className="block text-2xl font-extrabold text-purple-400">100%</span>
              <span className="text-[11px] font-semibold text-slate-400">Server Eligibility Guard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="py-16 md:py-24 bg-slate-950/40 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Live Preview</span>
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience the Platform Across Every Role
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Click the tabs below to test live interactive simulator widgets for students, faculty, recruiters, and campus administrators.
            </p>

            {/* Interactive Tab Switcher (2x2 on mobile, inline pill bar on desktop) */}
            <div className="mt-8 grid grid-cols-2 sm:inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 gap-1.5 shadow-inner w-full sm:w-auto max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Hub</span>
              </button>
              <button
                onClick={() => setActiveTab('faculty')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Faculty Suite</span>
              </button>
              <button
                onClick={() => setActiveTab('placement')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'placement'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Placement Funnel</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
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
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-300">Attendance Standing</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Safe Zone
                  </span>
                </div>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-emerald-500/20 bg-emerald-500/5">
                    <div className="text-center">
                      <span className="text-2xl font-black text-white">88.5%</span>
                      <span className="text-[10px] text-slate-400 block">Overall</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>DBMS (CS401)</span>
                    <span className="font-semibold text-emerald-400">92%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Computer Networks (CS403)</span>
                    <span className="font-semibold text-emerald-400">85%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Study Schedule */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 border border-indigo-500/30 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Study Plan (7 Days)</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">Automated Revision Roadmap</h4>
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span>Mon: Relational Normalization (1NF-BCNF)</span>
                    <span className="text-indigo-400 font-bold">1.5 hrs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span>Tue: TCP Flow & Congestion Control</span>
                    <span className="text-indigo-400 font-bold">2.0 hrs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span>Wed: Virtual Memory & Page Faults</span>
                    <span className="text-indigo-400 font-bold">1.5 hrs</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Weak Area Flagged:</span>
                  <span className="font-bold text-amber-400">Operating Systems (62%)</span>
                </div>
              </div>

              {/* Card 3: Semester CGPA & Coursework */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-300">Academic Standing</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Top 5%
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3">
                    <span className="text-xs text-slate-400">Cumulative GPA:</span>
                    <span className="block text-3xl font-black text-cyan-400">8.80 / 10.0</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>• Department: Computer Science (B.Tech)</p>
                    <p>• Semester: 4th Semester (Active)</p>
                    <p>• Active Backlogs: 0</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchPersona('student1@anurag.edu.in', 'Student@123')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
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
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Database Management Systems (CS401)</h4>
                    <p className="text-[11px] text-slate-400">Class Attendance Sheet • 4th Semester CSE</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Live Session
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Rahul Sharma</span>
                      <span className="text-[10px] text-slate-400">23AUCS001</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PRESENT
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Priya Patel</span>
                      <span className="text-[10px] text-slate-400">23AUCS002</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PRESENT
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Amit Kumar</span>
                      <span className="text-[10px] text-slate-400">23AUCS003</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      ABSENT (ALERT)
                    </span>
                  </div>
                </div>
              </div>

              {/* Faculty Tools */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Faculty Diagnostics</h4>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="font-semibold text-white block mb-1">AI Student Synthesizer</span>
                      <p className="text-[11px] text-slate-400">
                        Generate comprehensive executive summaries on any student's performance with 1 click.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="font-semibold text-white block mb-1">Coursework Review Drawer</span>
                      <p className="text-[11px] text-slate-400">
                        Review uploaded assignment submissions, verify timestamps, and return rubric grades.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchPersona('faculty.cs@anurag.edu.in', 'Faculty@123')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors cursor-pointer"
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
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                  Test Server-Side Eligibility Engine
                </h4>
                <p className="text-[11px] text-slate-400 mb-4">
                  Adjust student credentials to see automated qualification against corporate drive criteria:
                </p>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Simulated CGPA:</span>
                      <span className="font-bold text-cyan-400">{demoCgpa.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="10.0"
                      step="0.1"
                      value={demoCgpa}
                      onChange={(e) => setDemoCgpa(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Active Backlogs:</span>
                      <span className="font-bold text-rose-400">{demoBacklogs}</span>
                    </div>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((b) => (
                        <button
                          key={b}
                          onClick={() => setDemoBacklogs(b)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            demoBacklogs === b
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-950 border border-slate-800 text-slate-400'
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
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Live Drive Eligibility Qualification
                </h4>
                <div className="space-y-2.5 text-xs">
                  {/* Google */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">Google</span>
                        <span className="text-[10px] text-slate-400">Software Engineer III • 42 LPA</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Requires CGPA ≥ 8.5 & 0 Backlogs</span>
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
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">Amazon AWS</span>
                        <span className="text-[10px] text-slate-400">Cloud Development Associate • 28 LPA</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Requires CGPA ≥ 7.5 & 0 Backlogs</span>
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
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-sm">Infosys Ltd</span>
                        <span className="text-[10px] text-slate-400">Specialist Programmer • 9.5 LPA</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Requires CGPA ≥ 6.0 & ≤ 1 Backlog</span>
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
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Departmental Structure</h4>
                <div className="space-y-2 mt-3 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between">
                    <span className="font-semibold text-white">Computer Science (CSE)</span>
                    <span className="text-blue-400 font-bold">4 Faculty • 8 Students</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between">
                    <span className="font-semibold text-white">Electronics (ECE)</span>
                    <span className="text-blue-400 font-bold">1 Faculty • 1 Student</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between">
                    <span className="font-semibold text-white">Mechanical (MECH)</span>
                    <span className="text-blue-400 font-bold">1 Faculty • 1 Student</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Pending Approvals Queue (Anurag University)
                    </h4>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      2 Needs Review
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Bonafide Certificate Request</span>
                        <span className="text-[10px] text-slate-400">By Rahul Sharma • For Passport Application</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        PENDING
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Medical Leave Sanction</span>
                        <span className="text-[10px] text-slate-400">By Amit Kumar • 3 Days with Doctor Slip</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        PENDING
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchPersona('admin@anurag.edu.in', 'Admin@123')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  Enter Campus Administrator Workspace →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5-Role Interactive Portal Selector */}
      <section id="personas" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Role-Based Command Centers</span>
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Launch Any Persona with 1-Click
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Click any demo portal card below to jump straight to the Sign-In console with pre-filled credentials for instant evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolePersonas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.badgeColor} p-2 flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {p.highlight}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors">
                    {p.role}
                  </h4>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">{p.title}</span>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 font-mono">
                    <span>{p.email}</span>
                  </div>
                  <button
                    onClick={() => handleLaunchPersona(p.email, p.password)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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

      {/* Architectural Pillars & Feature Grid */}
      <section id="features" className="py-16 md:py-24 bg-slate-950/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture</span>
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Precision, Zero Bloat
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Built strictly on the classic MERN stack (MongoDB, Express, React, Node.js) with production-grade security, indexing, and deterministic fallbacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} p-2 flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Placement Hub Banner */}
      <section id="placements" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 block">
              Corporate Recruitment Engine
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Connected with Leading Tech Enterprises
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              CampusFlow automates end-to-end recruitment drives for Anurag University students. From dynamic criteria evaluation to multi-stage interview scheduling, offers are tracked with zero administrative friction.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google (42 LPA)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Microsoft (38 LPA)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Amazon AWS (28 LPA)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Frequently Asked</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Questions & Architecture Details</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 border-t border-slate-800/80 bg-slate-950/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Explore CampusFlow?
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Log in to your institutional workspace or test any role in under 10 seconds.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-xl hover:brightness-110 shadow-lg shadow-indigo-500/25 transition-all"
            >
              Sign In to Your Workspace
            </Link>
            <a
              href="#personas"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
            >
              Select Demo Persona
            </a>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-400">CampusFlow</span>
            <span>• Anurag University, Hyderabad, Telangana</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational (v1.2.0 • MERN Stack Only)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
