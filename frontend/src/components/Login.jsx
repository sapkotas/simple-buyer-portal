import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://simple-buyer-portal.vercel.app/api'; //port

export default function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        navigate('/dashboard');
      } else {
        await axios.post(`${API_URL}/auth/register`, formData);
        setSuccess('Registration successful! You can now login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      }}
    >
      {/* Background Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <span className="text-3xl">🏡</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Buyer Portal</h1>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Real-Estate Nepal</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 backdrop-blur-xl"
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.08)',
          }}
        >
          {/* Tab Switcher */}
          <div className="flex rounded-xl p-1 mb-8"
            style={{ background: 'rgba(15, 23, 42, 0.5)' }}
          >
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300"
              style={{
                background: isLogin ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: isLogin ? '#fff' : '#94a3b8',
                boxShadow: isLogin ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300"
              style={{
                background: !isLogin ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: !isLogin ? '#fff' : '#94a3b8',
                boxShadow: !isLogin ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
              }}
            >
              Register
            </button>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">
            {isLogin ? 'Welcome back 👋' : 'Create your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 outline-none"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    color: '#f1f5f9',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 outline-none"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  color: '#f1f5f9',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 outline-none"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  color: '#f1f5f9',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'}
                required
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-slide-down"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}
              >
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-slide-down"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}
              >
                <span>✅</span> {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 cursor-pointer"
              style={{
                background: loading
                  ? '#4f46e5'
                  : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.35)';
              }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm" style={{ color: '#64748b' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="font-semibold transition-colors duration-200 cursor-pointer"
            style={{ color: '#818cf8' }}
            onMouseEnter={(e) => e.target.style.color = '#a5b4fc'}
            onMouseLeave={(e) => e.target.style.color = '#818cf8'}
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}