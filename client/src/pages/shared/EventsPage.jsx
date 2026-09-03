import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Toast from '../../components/common/Toast';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function EventsPage() {
  const { user } = useAuth();
  const isStaff = user?.role === 'COLLEGE_ADMIN' || user?.role === 'FACULTY' || user?.role === 'SUPER_ADMIN';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'ACADEMIC',
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    registrationRequired: true,
    maxParticipants: 100,
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAll();
      if (res.success) setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(formData);
      setIsModalOpen(false);
      setToastMessage('Event announced successfully!');
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventService.register(eventId);
      setToastMessage('Registered for event successfully!');
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      await eventService.cancelRegistration(eventId);
      setToastMessage('Registration cancelled.');
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading && events.length === 0) return <LoadingSkeleton rows={6} />;

  return (
    <div className="space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Campus Events & Calendar</h1>
          <p className="text-xs text-slate-500 mt-1">
            Technical symposiums, hackathons, keynote guest lectures, and academic schedules
          </p>
        </div>
        {isStaff && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Announce Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => {
          const isRegistered = event.attendees?.some(
            (a) =>
              a.studentId?._id?.toString() === user?._id?.toString() ||
              a.studentId?.toString() === user?._id?.toString()
          );

          return (
            <div
              key={event._id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="teal" size="sm">
                    {event.eventType}
                  </Badge>
                  {isRegistered && (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-base mt-2">{event.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {new Date(event.startDate).toLocaleDateString()} –{' '}
                    {new Date(event.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Organizer: {event.organizer || 'College'}
                  </span>
                  {user?.role === 'STUDENT' && event.registrationRequired && (
                    <button
                      onClick={() =>
                        isRegistered ? handleCancelRegistration(event._id) : handleRegister(event._id)
                      }
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${
                        isRegistered
                          ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      {isRegistered ? 'Cancel Registration' : 'Register Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Announce Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Announce Campus Event">
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. National Hackathon 2026"
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="ACADEMIC">Academic</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="CULTURAL">Cultural</option>
                <option value="SPORTS">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Venue / Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Auditorium / Lab"
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Description</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.registrationRequired}
                onChange={(e) =>
                  setFormData({ ...formData, registrationRequired: e.target.checked })
                }
                className="rounded text-teal-600"
              />
              Enable Student Self-Registration
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              Publish Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
