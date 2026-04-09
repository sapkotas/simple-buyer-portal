import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyCard from './PropertyCard';

const API_URL = 'https://simple-buyer-portal.vercel.app/api';

export default function Dashboard({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favourites'
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
    Promise.all([fetchProperties(), fetchFavourites()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/properties`);
      setProperties(res.data);
    } catch {
      showToast('Failed to load properties', 'error');
    }
  };

  const fetchFavourites = async () => {
    try {
      const res = await axios.get(`${API_URL}/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavourites(res.data);
    } catch {}
  };

  const toggleFavourite = async (propertyId) => {
    const isCurrentlyFav = favourites.some((f) => f.id === propertyId);
    try {
      if (isCurrentlyFav) {
        await axios.delete(`${API_URL}/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { propertyId },
        });
        showToast('Removed from favourites');
      } else {
        await axios.post(
          `${API_URL}/favourites`,
          { propertyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Added to favourites ❤️');
      }
      fetchFavourites();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    navigate('/login');
  };

  const displayedProperties =
    activeTab === 'favourites' ? favourites : properties;

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading your portal…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-200">
              <span className="text-lg">🏡</span>
            </div>
            <span className="text-lg font-bold text-slate-800 hidden sm:block">Buyer Portal</span>
          </div>

          {/* Tabs */}
          <nav className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {['all', 'favourites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'favourites' ? `❤️ Saved (${favourites.length})` : '🏘️ All Properties'}
              </button>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-medium">{user.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Strip*/}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-3 gap-4">
          {[
            { label: 'All Properties', value: properties.length, icon: '🏘️', color: 'text-indigo-600' },
            { label: 'Saved', value: favourites.length, icon: '❤️', color: 'text-rose-500' },
            { label: 'Available', value: properties.length, icon: '✅', color: 'text-emerald-600' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-3 gap-1">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-400 font-medium whitespace-nowrap">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'favourites' ? 'Your Saved Properties' : 'Available Properties'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {activeTab === 'favourites'
                ? favourites.length === 0 ? 'No saved properties yet' : `${favourites.length} saved`
                : `${properties.length} properties found`}
            </p>
          </div>

          {activeTab === 'all' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-400 w-48 sm:w-64">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search properties…</span>
            </div>
          )}
        </div>

        {/* Empty state */}
        {displayedProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">{activeTab === 'favourites' ? '💔' : '🏚️'}</span>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              {activeTab === 'favourites' ? 'No saved properties' : 'No properties yet'}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs">
              {activeTab === 'favourites'
                ? 'Browse all properties and tap the heart to save your favourites.'
                : 'Check back soon for new listings.'}
            </p>
            {activeTab === 'favourites' && (
              <button
                onClick={() => setActiveTab('all')}
                className="mt-5 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Browse Properties
              </button>
            )}
          </div>
        )}

        {/* Property grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedProperties.map((prop, i) => {
            const isFav = favourites.some((f) => f.id === prop.id);
            return (
              <PropertyCard
                key={prop.id}
                property={prop}
                isFav={isFav}
                onToggle={() => toggleFavourite(prop.id)}
                index={i}
              />
            );
          })}
        </div>
      </main>

    
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl transition-all duration-300 flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
          }`}
        >
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  );
}