import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfileStore } from '../store/profileStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, profile, refreshProfile, isLoading: authLoading } = useAuth();
  const { updateProfile, uploadAvatar, isLoading: profileLoading } = useProfileStore();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    avatar_url: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        avatar_url: profile.avatar_url || ''
      });
      
      // Reset preview when profile changes
      setAvatarPreview('');
      setAvatarFile(null);
    }
  }, [profile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Image file is too large. Maximum size is 2MB.');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
        return;
      }
      
      setAvatarFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      
      // Clear any previous errors
      setUploadError('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    
    try {
      let updatedData = { ...formData };
      
      // If there's a new avatar file, upload it first
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(avatarFile, user.id);
        updatedData.avatar_url = avatarUrl;
      }
      
      await updateProfile(user.id, updatedData);
      
      // Refresh profile data after update to update navbar
      await refreshProfile();
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      // Clean up the preview URL object
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview('');
      }
      setAvatarFile(null);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    }
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A0B2E] to-[#2C1952] flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#5D3BE7]"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FF]">
        <p className="text-lg text-[#2C1952] bg-white p-8 rounded-xl shadow-lg">Please log in to view your profile.</p>
      </div>
    );
  }
  
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
    <div className="min-h-screen bg-[#F5F7FF] py-20 px-4">
      {/* Curved background header */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-[#1A0B2E] to-[#2C1952] -z-10"></div>
      <div className="absolute top-0 left-0 w-full overflow-hidden h-64 -z-10">
        <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#F5F7FF" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,160C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Left column - avatar and quick info */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-[#5D3BE7] to-[#4A2EC0] relative">
                {/* Decorative shapes */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10"></div>
                <div className="absolute bottom-0 left-4 w-12 h-12 rounded-full bg-white/10"></div>
              </div>
              
              <div className="px-6 pb-6 -mt-12 text-center">
                <div className="inline-block rounded-full p-2 bg-white shadow-lg mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white"
                    />
                  ) : profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || "User's profile"}
                      className="h-24 w-24 rounded-full object-cover border-4 border-white"
                      onError={(e) => {
                        // If image fails to load, show initials instead
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`h-24 w-24 rounded-full bg-gradient-to-br from-[#5D3BE7] to-[#4A2EC0] flex items-center justify-center text-white text-3xl font-medium ${
                      profile?.avatar_url && !avatarPreview ? 'hidden' : ''
                    }`}
                  >
                    {getInitials()}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-[#2C1952] mb-1">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-[#8C8C9E] text-sm mb-4">{user.email}</p>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5D3BE7]/10 text-[#5D3BE7] font-medium transition-all hover:bg-[#5D3BE7]/20 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
              
              {profile?.is_admin && (
                <div className="px-6 pb-6">
                  <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8989]/10 text-[#FF6B6B] font-medium text-center">
                    Administrator
                  </div>
                </div>
              )}
              
              <div className="px-6 py-5 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-[#2C1952] mb-4">Account Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#5D3BE7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-[#8C8C9E]">Joined</p>
                      <p className="font-medium text-[#2C1952]">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#5D3BE7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-[#8C8C9E]">Phone</p>
                      <p className="font-medium text-[#2C1952]">
                        {profile?.phone_number || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - profile edit form or details */}
          <div className="w-full md:w-2/3">
            {message.text && (
              <div className={`mb-5 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
                message.type === 'success' 
                  ? 'bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20' 
                  : 'bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {message.type === 'success' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
                <span>{message.text}</span>
              </div>
            )}
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#2C1952]">Personal Information</h2>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-[#5D3BE7] hover:text-[#4A2EC0] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-[#2C1952] mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5D3BE7] focus:border-[#5D3BE7] outline-none transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#2C1952] mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-[#8C8C9E]"
                        />
                        <p className="mt-2 text-xs text-[#8C8C9E]">Email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-[#2C1952] mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5D3BE7] focus:border-[#5D3BE7] outline-none transition-all"
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#2C1952] mb-2">
                          Profile Picture
                        </label>
                        
                        <div className="mt-2 flex items-center">
                          <div className="mr-4">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="h-16 w-16 rounded-full object-cover border-2 border-[#5D3BE7]"
                              />
                            ) : profile?.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.full_name || "User's profile"}
                                className="h-16 w-16 rounded-full object-cover border-2 border-[#5D3BE7]"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-16 w-16 rounded-full bg-gradient-to-br from-[#5D3BE7] to-[#4A2EC0] flex items-center justify-center text-white text-xl font-medium ${
                                profile?.avatar_url && !avatarPreview ? 'hidden' : ''
                              }`}
                            >
                              {getInitials()}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <input 
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              onChange={handleAvatarChange}
                            />
                            <button
                              type="button"
                              onClick={triggerFileInput}
                              className="px-4 py-2 bg-[#5D3BE7]/10 text-[#5D3BE7] rounded-lg hover:bg-[#5D3BE7]/20 transition-colors font-medium text-sm mr-3"
                            >
                              Choose File
                            </button>
                            <span className="text-sm text-[#8C8C9E]">
                              {avatarFile ? avatarFile.name : 'No file selected'}
                            </span>
                            
                            {uploadError && (
                              <p className="mt-2 text-sm text-[#FF6B6B]">{uploadError}</p>
                            )}
                            <p className="mt-2 text-xs text-[#8C8C9E]">
                              Supported formats: JPEG, PNG, GIF, WebP. Max size: 2MB.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="avatar_url" className="block text-sm font-medium text-[#2C1952] mb-2">
                          Avatar URL <span className="text-xs text-[#8C8C9E]">(Alternative to file upload)</span>
                        </label>
                        <input
                          type="text"
                          id="avatar_url"
                          name="avatar_url"
                          value={formData.avatar_url}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5D3BE7] focus:border-[#5D3BE7] outline-none transition-all"
                          placeholder="https://example.com/your-avatar.jpg"
                        />
                        <p className="mt-2 text-xs text-[#8C8C9E]">You can enter a URL to an image instead of uploading a file</p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#5D3BE7] text-white font-medium hover:bg-[#4A2EC0] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                        disabled={profileLoading}
                      >
                        {profileLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-[#8C8C9E] mb-1">About me</h3>
                      <p className="text-[#2C1952]">
                        {profile?.bio || 'No bio provided. Edit your profile to add a bio.'}
                      </p>
                    </div>
                    
                    {/* Profile Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-[#5D3BE7]/5 text-center">
                        <div className="text-2xl font-bold text-[#5D3BE7]">0</div>
                        <div className="text-sm text-[#8C8C9E]">Courses Enrolled</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#00E5A0]/5 text-center">
                        <div className="text-2xl font-bold text-[#00E5A0]">0</div>
                        <div className="text-sm text-[#8C8C9E]">Completed</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#FF6B6B]/5 text-center">
                        <div className="text-2xl font-bold text-[#FF6B6B]">0</div>
                        <div className="text-sm text-[#8C8C9E]">Certificates</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-lg font-semibold text-[#2C1952] mb-4">Account Security</h3>
                      <div className="bg-[#F5F7FF] rounded-xl p-4 flex items-start gap-4">
                        <div className="p-2 rounded-full bg-[#5D3BE7]/10 text-[#5D3BE7]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#2C1952] mb-1">Password</h4>
                          <p className="text-sm text-[#8C8C9E] mb-3">We recommend changing your password regularly to keep your account secure.</p>
                          <button className="text-sm bg-white text-[#5D3BE7] px-4 py-2 rounded-lg border border-[#5D3BE7]/20 hover:bg-[#5D3BE7]/10 transition-colors">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 