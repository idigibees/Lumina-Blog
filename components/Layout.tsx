import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setUser: (user: User | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleLogout = () => {
    StorageService.logout();
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Reading Progress Bar Logic
  useEffect(() => {
    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${totalScroll / windowHeight}`;
        setScrollProgress(Number(scrolled));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Reading Progress Bar (Only visible on post detail pages usually, but kept global for premium feel) */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
        <div 
            className="h-full bg-indigo-600 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 border-b border-gray-200/50 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  L
                </div>
                <span className="font-serif text-2xl font-bold text-slate-900 tracking-tight">Lumina</span>
              </Link>
              <div className="hidden md:flex md:space-x-8">
                <Link
                  to="/"
                  className={`${isActive('/') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-900'} inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200`}
                >
                  Discover
                </Link>
                {user && (
                    <Link
                    to="/write"
                    className={`${isActive('/write') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-900'} inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200`}
                    >
                    Write
                    </Link>
                )}
                {user?.role === UserRole.ADMIN && (
                   <Link
                   to="/admin"
                   className={`${isActive('/admin') ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-900'} inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200`}
                   >
                   Dashboard
                   </Link>
                )}
              </div>
            </div>
            
            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">${user.earnings.toFixed(2)} Revenue</p>
                  </div>
                  <div className="relative group cursor-pointer">
                    <img
                        className="h-10 w-10 rounded-full ring-2 ring-white shadow-md object-cover transition-transform group-hover:scale-105"
                        src={user.avatar}
                        alt={user.name}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/login"
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                    {isMobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                 </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-4 flex flex-col gap-4 animate-fade-in">
                <Link to="/" className="text-lg font-medium text-slate-900 py-2 border-b border-gray-50">Discover</Link>
                {user && <Link to="/write" className="text-lg font-medium text-slate-900 py-2 border-b border-gray-50">Write Story</Link>}
                {user?.role === UserRole.ADMIN && <Link to="/admin" className="text-lg font-medium text-slate-900 py-2 border-b border-gray-50">Admin Dashboard</Link>}
                
                {user ? (
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-bold text-slate-900">{user.name}</p>
                                <p className="text-xs text-gray-500">${user.earnings.toFixed(2)} Revenue</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-red-500 text-sm font-bold">Sign Out</button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 pt-4">
                        <Link to="/login" className="w-full text-center py-3 border border-gray-200 rounded-lg font-bold text-slate-700">Log In</Link>
                        <Link to="/login" className="w-full text-center py-3 bg-indigo-600 text-white rounded-lg font-bold">Sign Up</Link>
                    </div>
                )}
            </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
                        <span className="font-serif font-bold text-xl text-slate-900">Lumina</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        A premium publishing platform tailored for storytellers who value aesthetics and community.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 tracking-wide text-sm uppercase">Platform</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Trending</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Collections</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Authors</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Publications</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 tracking-wide text-sm uppercase">Company</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Our Story</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 tracking-wide text-sm uppercase">Connect</h4>
                     <ul className="space-y-3 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-indigo-600 transition-colors">Support</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">© 2024 Lumina Blog Inc. All rights reserved.</p>
                <div className="flex gap-6">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   <span className="text-xs text-gray-400 font-medium">Systems Operational</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;