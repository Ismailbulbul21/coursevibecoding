import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAuthStore } from '../store/authStore';

const ProfileDropdown = () => {
  const { user, profile } = useAuth();
  const { signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  // Get initials for avatar placeholder
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || '??';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-gray-100 transition-all duration-200 ease-in-out focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open user menu</span>
        {profile?.avatar_url ? (
          <img
            className="h-7 w-7 rounded-full object-cover border border-blue-100 shadow-sm"
            src={profile.avatar_url}
            alt={profile.full_name || "User avatar"}
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-gradient-blue flex items-center justify-center text-white text-xs font-medium shadow-sm">
            {getInitials()}
          </div>
        )}
        <span className="text-sm text-gray-700 hidden md:block max-w-[100px] truncate">
          {profile?.full_name || user?.email?.split('@')[0] || 'User'}
        </span>
        <svg
          className={`h-4 w-4 text-gray-500 hidden md:block transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu with animation */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 fade-in">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Link
            to="/profile"
            className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            Shakhsiyadda
          </Link>
          <Link
            to="/dashboard"
            className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            Bogga Guud
          </Link>
          <Link
            to="/payments"
            className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={() => setIsOpen(false)}
          >
            Lacag Bixinta
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors duration-150"
          >
            Ka Bax
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 