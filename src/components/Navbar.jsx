import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../store/authStore';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const isHomePage = location.pathname === '/';
  const isCoursesPage = location.pathname === '/courses';
  const needsContrast = isHomePage || isCoursesPage;
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-transparent' 
        : needsContrast 
          ? 'bg-gradient-to-r from-[#2C1952]/80 to-[#5D3BE7]/80 backdrop-blur-md border-[#5D3BE7]/30 shadow-[0_4px_20px_rgba(93,59,231,0.3)]' 
          : 'bg-white/90 backdrop-blur-md shadow-lg border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="h-10 w-10 rounded-lg bg-[#5D3BE7] flex items-center justify-center text-white mr-3 relative overflow-hidden transition-all duration-300 group-hover:rotate-6 shadow-[0_0_15px_rgba(93,59,231,0.6)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="absolute inset-0 bg-[#FF6B6B] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold transition-all duration-300 ${
                  scrolled ? 'text-[#2C1952]' : 'text-white'
                } group-hover:text-[#5D3BE7] ${!scrolled && !needsContrast ? 'text-[#2C1952]' : ''}`}>LearnHub</span>
                {!scrolled && needsContrast && (
                  <span className="text-[#00E5A0] text-xs font-medium">Connect & Learn</span>
                )}
              </div>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-6">
                <Link 
                  to="/" 
                  className={`relative font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'text-white bg-[#5D3BE7] shadow-[0_0_10px_rgba(93,59,231,0.5)]' 
                      : scrolled 
                        ? 'text-[#2C1952] hover:bg-[#5D3BE7]/10 hover:text-[#5D3BE7]' 
                        : needsContrast
                          ? 'text-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                          : 'text-[#2C1952] hover:bg-[#5D3BE7]/10 hover:text-[#5D3BE7]'
                  }`}
                >
                  <span className="relative z-10">Home</span>
                  {isActive('/') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00E5A0] rounded-full"></span>
                  )}
                </Link>
                
                <Link 
                  to="/courses" 
                  className={`relative font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/courses') 
                      ? 'text-white bg-[#5D3BE7] shadow-[0_0_10px_rgba(93,59,231,0.5)]' 
                      : scrolled 
                        ? 'text-[#2C1952] hover:bg-[#5D3BE7]/10 hover:text-[#5D3BE7]' 
                        : needsContrast
                          ? 'text-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                          : 'text-[#2C1952] hover:bg-[#5D3BE7]/10 hover:text-[#5D3BE7]'
                  }`}
                >
                  <span className="relative z-10">Courses</span>
                  {isActive('/courses') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#00E5A0] rounded-full"></span>
                  )}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`relative font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive('/admin') 
                        ? 'text-white bg-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.5)]' 
                        : scrolled 
                          ? 'text-[#2C1952] hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]' 
                          : needsContrast
                            ? 'text-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                            : 'text-[#2C1952] hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]'
                    }`}
                  >
                    <span className="relative z-10">Admin</span>
                    {isActive('/admin') && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#FF6B6B] rounded-full"></span>
                    )}
                  </Link>
                )}
                <ProfileDropdown scrolled={scrolled} needsContrast={needsContrast} />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`font-medium px-3 py-2 rounded-lg transition-all duration-300 ${
                    scrolled 
                      ? 'text-[#2C1952] hover:bg-[#5D3BE7]/10 hover:text-[#5D3BE7]' 
                      : needsContrast
                        ? 'text-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                        : 'text-[#2C1952] hover:bg-[#5D3BE7]/10 hover:text-[#5D3BE7]'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="relative overflow-hidden group bg-[#5D3BE7] text-white px-6 py-2.5 rounded-full font-medium transform transition-all hover:translate-y-[-2px] hover:shadow-[0_5px_15px_rgba(93,59,231,0.4)]"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#5D3BE7] via-[#7E60FF] to-[#5D3BE7] bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500"></span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-full w-10 h-10 transition-all duration-300 ${
                scrolled 
                  ? 'text-[#2C1952] hover:bg-[#5D3BE7]/10' 
                  : needsContrast 
                    ? 'text-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                    : 'text-[#2C1952] hover:bg-[#5D3BE7]/10'
              } focus:outline-none`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 animate-slide-down shadow-xl">
          <div className="px-4 py-5 space-y-3">
            <Link 
              to="/" 
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive('/') 
                  ? 'bg-[#5D3BE7]/10 text-[#5D3BE7]' 
                  : 'text-[#2C1952] hover:bg-[#5D3BE7]/5 hover:text-[#5D3BE7]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive('/courses') 
                  ? 'bg-[#5D3BE7]/10 text-[#5D3BE7]' 
                  : 'text-[#2C1952] hover:bg-[#5D3BE7]/5 hover:text-[#5D3BE7]'
              }`}
            >
              Courses
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive('/admin') 
                        ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' 
                        : 'text-[#2C1952] hover:bg-[#FF6B6B]/5 hover:text-[#FF6B6B]'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive('/profile') 
                      ? 'bg-[#5D3BE7]/10 text-[#5D3BE7]' 
                      : 'text-[#2C1952] hover:bg-[#5D3BE7]/5 hover:text-[#5D3BE7]'
                  }`}
                >
                  Profile
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-[#5D3BE7]/10 text-[#5D3BE7]' 
                      : 'text-[#2C1952] hover:bg-[#5D3BE7]/5 hover:text-[#5D3BE7]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/payments" 
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive('/payments') 
                      ? 'bg-[#5D3BE7]/10 text-[#5D3BE7]' 
                      : 'text-[#2C1952] hover:bg-[#5D3BE7]/5 hover:text-[#5D3BE7]'
                  }`}
                >
                  Payments
                </Link>
                
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-[#FF6B6B] hover:bg-[#FF6B6B]/5 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-gray-100">
                <Link 
                  to="/login" 
                  className="text-center px-4 py-3 rounded-xl text-base font-medium text-[#5D3BE7] border border-[#5D3BE7]/30 hover:bg-[#5D3BE7]/5 transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="text-center px-4 py-3 rounded-xl text-base font-medium bg-[#5D3BE7] text-white hover:bg-[#4A2EC0] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 