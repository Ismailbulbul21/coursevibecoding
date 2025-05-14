import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../contexts/AuthContext';

const ProfileDropdown = ({ scrolled, needsContrast }) => {
  const { user, profile } = useAuth();
  const { signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
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

  // Reset avatar error when profile changes
  useEffect(() => {
    setAvatarError(false);
  }, [profile]);
  
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
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
          scrolled 
            ? 'text-[#2C1952] hover:bg-[#5D3BE7]/10' 
            : needsContrast
              ? 'text-white hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
              : 'text-[#2C1952] hover:bg-[#5D3BE7]/10'
        }`}
      >
        {/* Profile Avatar with Electric Glow */}
        <div className={`relative w-9 h-9 rounded-full overflow-hidden ${isOpen ? 'animate-electric-pulse' : ''}`}>
          {profile?.avatar_url && !avatarError ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5D3BE7] to-[#00D2FF] flex items-center justify-center text-white font-semibold">
              <span>{getInitials()}</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full border-2 border-white -m-0.5"></div>
        </div>
        
        <div className={`hidden md:block transition-colors ${
          scrolled ? 'text-[#2C1952]' : needsContrast ? 'text-white' : 'text-[#2C1952]'
        }`}>
          <span className="text-sm font-medium truncate max-w-[120px] block">
            {profile?.full_name || user?.email?.split('@')[0] || 'User'}
          </span>
        </div>
        
        <svg 
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} ${
            scrolled ? 'text-[#2C1952]' : needsContrast ? 'text-white' : 'text-[#2C1952]'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-xl border border-[#5D3BE7]/10 py-1 animate-slide-down divide-y divide-gray-100 z-50 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-[#5D3BE7] to-[#00D2FF] p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm">
                {profile?.avatar_url && !avatarError ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="uppercase font-bold">{getInitials()}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-white/80 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-1">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-3 hover:bg-[#5D3BE7]/5 text-[#2C1952] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-[#5D3BE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Profile</span>
            </Link>
            
            <Link 
              to="/dashboard" 
              className="flex items-center px-4 py-3 hover:bg-[#5D3BE7]/5 text-[#2C1952] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-[#00D2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/payments" 
              className="flex items-center px-4 py-3 hover:bg-[#5D3BE7]/5 text-[#2C1952] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-[#00FFF0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <span>Payments</span>
            </Link>
          </div>
          
          <div className="py-1">
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-3 hover:bg-[#5D3BE7]/5 text-[#2C1952] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-[#8C8C9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Settings</span>
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-4 py-3 hover:bg-[#FF3366]/5 text-[#FF3366] transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
          
          {/* Animated Electric Line at Bottom */}
          <div className="h-1 w-full bg-gradient-to-r from-[#5D3BE7] via-[#00D2FF] to-[#00FFF0] animate-electric-border"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 