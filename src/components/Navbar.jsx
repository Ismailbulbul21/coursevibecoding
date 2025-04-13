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
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };
  
  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-[#346B7E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-[#346B7E] text-xl font-bold">BulbulAI</span>
            </Link>
            <div className="hidden md:block ml-6">
              <div className="flex items-center space-x-1">
                <Link to="/" className={`nav-btn ${isActive('/') ? 'nav-btn-primary' : ''} pulse-on-hover`}>
                  Bogga Hore
                </Link>
                <Link to="/courses" className={`nav-btn ${isActive('/courses') ? 'nav-btn-primary' : ''} pulse-on-hover`}>
                  Koorsooyinka
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin" className={`nav-btn ${isActive('/admin') ? 'nav-btn-primary' : ''}`}>
                    Maamulka
                  </Link>
                )}
                <div className="ml-2">
                  <ProfileDropdown />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="nav-btn">
                  Gal
                </Link>
                <Link 
                  to="/register" 
                  className="nav-btn nav-btn-primary pulse-on-hover"
                >
                  Iska Diiwaan Geli
                </Link>
              </div>
            )}
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#346B7E] focus:outline-none transition-transform duration-300 ease-in-out"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 ${isMenuOpen ? 'transform rotate-90' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
      
      {/* Mobile menu with fade-in animation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 fade-in">
          <div className="px-2 pt-2 pb-3 space-y-2">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'nav-btn-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Bogga Hore
            </Link>
            <Link 
              to="/courses" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/courses') ? 'nav-btn-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              Koorsooyinka
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin') ? 'nav-btn-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Maamulka
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'nav-btn-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Shakhsiyadda
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'nav-btn-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Bogga Guud
                </Link>
                <Link 
                  to="/payments" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/payments') ? 'nav-btn-primary' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Lacag Bixinta
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Ka Bax
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  Gal
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  Iska Diiwaan Geli
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 