import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';
import { User, Mail, Phone, Building, Briefcase, Award, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [phone, setPhone] = useState(user?.phone || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await authService.updateProfile({
        phone,
        skills: skillsArray,
        resumeUrl,
      });

      if (res.success) {
        updateUser(res.data);
        setToastMessage('Profile updated successfully!');
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile & Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal contact details, technical skills inventory, and placement resume
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        {/* Header Avatar & Role */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
              <Badge variant="teal">{user?.role?.replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.institutionId?.name || 'CampusFlow Global'} • {user?.departmentId?.name || 'General'}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Contact Phone
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Roll / Employee Identifier
              </label>
              <input
                type="text"
                disabled
                value={user?.rollNumber || user?.employeeId || 'N/A'}
                className="mt-1 block w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {user?.role === 'STUDENT' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Technical Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Java, Python, React, MongoDB, System Design"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">
                  Online Portfolio / Resume Link
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume"
                  className="mt-1 block w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
