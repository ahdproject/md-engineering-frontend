import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { setCredentials } from '../../app/authSlice';
import { loginApi } from '../../services/repository/authRepository';

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      if (data.success) {
        dispatch(setCredentials({ token: data.data.token, user: data.data.user }));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-black">

          {/* Header */}
          <div className="bg-black px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-black text-lg">M&D</span>
            </div>
            <h1 className="text-2xl font-bold text-white">M&D Engineers ERP</h1>
            <p className="text-gray-300 text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                  <input type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="admin@mdengineers.com"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl text-sm
                               bg-white focus:outline-none focus:border-black
                               focus:ring-2 focus:ring-black transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                  <input type={show ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 rounded-xl text-sm
                               bg-white focus:outline-none focus:border-black
                               focus:ring-2 focus:ring-black transition-all" />
                  <button type="button" onClick={() => setShow(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-semibold
                           rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-xl active:scale-[0.98]">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-black mt-4">
          M&D Engineers Private Limited © 2026
        </p>
      </div>
    </div>
  );
}