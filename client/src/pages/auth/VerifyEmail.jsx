import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const doVerify = async () => {
      if (!token) {
        setLoading(false);
        setMessage('Missing email verification token.');
        return;
      }
      try {
        const res = await authService.verifyEmail(token);
        setSuccess(true);
        setMessage(res.message || 'Email verified successfully.');
      } catch (err) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Verification token is invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    doVerify();
  }, [token]);

  return (
    <div className="text-center py-6">
      {loading ? (
        <div className="space-y-3">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Verifying your email address...</p>
        </div>
      ) : success ? (
        <div className="space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Email Verified!</h3>
          <p className="text-xs text-slate-500">{message}</p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block py-2 px-6 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Verification Failed</h3>
          <p className="text-xs text-slate-500">{message}</p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block py-2 px-6 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              Return to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
