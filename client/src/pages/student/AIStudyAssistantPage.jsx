import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  Layers,
} from 'lucide-react';

export default function AIStudyAssistantPage() {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'weak' | 'resources'

  // Roadmap Form
  const [subjectName, setSubjectName] = useState('Database Management Systems');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dailyHours, setDailyHours] = useState(3);
  const [currentConfidence, setCurrentConfidence] = useState(65);
  const [studyPlan, setStudyPlan] = useState(null);
  const [planningLoading, setPlanningLoading] = useState(false);

  // Weak Subject Analysis
  const [weakData, setWeakData] = useState(null);
  const [weakLoading, setWeakLoading] = useState(false);

  // Curated Resources
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setPlanningLoading(true);
    try {
      const res = await aiService.createStudyPlan({
        subjectName,
        examDate,
        availableHoursPerDay: dailyHours,
        currentPerformance: currentConfidence,
      });
      if (res.success) setStudyPlan(res.data);
    } catch (err) {
      alert('Failed to generate AI study plan');
    } finally {
      setPlanningLoading(false);
    }
  };

  const loadWeakAnalysis = async () => {
    setWeakLoading(true);
    try {
      const res = await aiService.getWeakSubjects();
      if (res.success) setWeakData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setWeakLoading(false);
    }
  };

  const loadResources = async () => {
    setResourceLoading(true);
    try {
      const res = await aiService.getRecommendations(subjectName);
      if (res.success) setResources(res.data.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setResourceLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'weak' && !weakData) {
      loadWeakAnalysis();
    }
    if (activeTab === 'resources') {
      loadResources();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-indigo-950 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Cognitive Academic Engine
          </div>
          <h1 className="text-2xl font-bold mt-1">AI Study Assistant & Revision Engine</h1>
          <p className="text-xs text-slate-300 mt-1">
            Data-driven study roadmaps, automated weak-area detection, and accredited learning resources
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'roadmap'
              ? 'border-teal-600 text-teal-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" /> 7-Day Revision Planner
        </button>
        <button
          onClick={() => setActiveTab('weak')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'weak'
              ? 'border-teal-600 text-teal-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" /> Weak Subject Diagnostics
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'border-teal-600 text-teal-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Curated Resources
        </button>
      </div>

      {/* TAB 1: ROADMAP PLANNER */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4 h-fit">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Exam Parameters
            </h2>

            <form onSubmit={handleGeneratePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Target Exam Date
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Available Study Hours / Day ({dailyHours} hrs)
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Current Confidence ({currentConfidence}%)
                </label>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={currentConfidence}
                  onChange={(e) => setCurrentConfidence(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                />
              </div>

              <button
                type="submit"
                disabled={planningLoading}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                {planningLoading ? 'Computing Roadmap...' : 'Generate AI Revision Plan'}
              </button>
            </form>
          </div>

          {/* Schedule Visualization */}
          <div className="lg:col-span-2 space-y-4">
            {studyPlan ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{studyPlan.subject}</h3>
                      <p className="text-xs text-slate-500">
                        {studyPlan.daysRemaining} days remaining until examination • {studyPlan.dailyHours} hrs/day
                      </p>
                    </div>
                    <Badge variant="teal">Intensive Plan</Badge>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 bg-teal-50/50 p-3 rounded-lg border border-teal-100/60 leading-relaxed">
                    {studyPlan.overview}
                  </p>
                </div>

                {/* Day Cards */}
                <div className="space-y-3">
                  {studyPlan.schedule.map((day, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:border-teal-300 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-sm text-teal-700">{day.day}</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {day.allocatedHours} Hours
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold text-slate-800 text-xs">{day.focusTopic}</p>
                        <ul className="mt-2 space-y-1 text-xs text-slate-600">
                          {day.recommendedActivities.map((act, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-1.5">
                              <span className="text-teal-500">•</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-md font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Daily Checkpoint: {day.checkpoint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
                <Sparkles className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">Plan Your Exam Revision</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Configure your subject and remaining study hours on the left to generate an adaptive day-by-day revision roadmap.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WEAK SUBJECT DIAGNOSTICS */}
      {activeTab === 'weak' && (
        <div className="space-y-4">
          {weakLoading ? (
            <LoadingSkeleton rows={5} />
          ) : weakData ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 text-base">
                  Diagnostic Performance Analysis for {weakData.studentName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Identified based on low historical average marks (&lt;65%) and attendance deficits (&lt;75%)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weakData.allSubjects?.map((sub) => (
                  <div
                    key={sub.subjectId}
                    className={`rounded-xl border p-5 shadow-sm bg-white space-y-3 ${
                      sub.isWeak ? 'border-rose-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant={sub.isWeak ? 'rose' : 'emerald'}>
                          {sub.isWeak ? 'Weak Subject' : 'On Track'}
                        </Badge>
                        <h4 className="font-bold text-slate-800 text-base mt-1.5">{sub.name}</h4>
                        <p className="text-xs text-slate-400">Code: {sub.code}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-slate-800">{sub.averageMarks}%</span>
                        <p className="text-[10px] text-slate-400">Avg Marks</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <p className="text-slate-500">
                        Attendance: <strong>{sub.attendancePercentage}%</strong>
                      </p>
                      <div className="space-y-1">
                        {sub.reasons.map((r, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-md ${
                              sub.isWeak
                                ? 'bg-rose-50 text-rose-800'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Loading analysis...</p>
          )}
        </div>
      )}

      {/* TAB 3: CURATED RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base">
              Accredited Learning References for {subjectName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified university open-courseware, textbooks, and tutorial portals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((res, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <Badge variant="blue" size="sm">
                    {res.type}
                  </Badge>
                  <h4 className="font-bold text-slate-800 text-sm mt-2">{res.title}</h4>
                </div>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700"
                >
                  Access Resource <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
