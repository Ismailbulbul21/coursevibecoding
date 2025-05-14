import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn, isLoading, error } = useAuthStore();
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setAuthError('');
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      setAuthError(error.message || 'Failed to sign in');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5D3BE7] opacity-5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#FF6B6B] opacity-5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#2C1952] mb-2">Welcome Back</h2>
            <p className="text-[#8C8C9E]">Sign in to continue your learning journey</p>
          </div>
          
          {authError && (
            <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] px-4 py-3 rounded-lg mb-6 animate-bounce-in">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {authError}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[#2C1952] text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8C8C9E]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-[#FF6B6B]' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D3BE7]/50 transition-all`}
                  placeholder="your@email.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-[#FF6B6B] text-sm mt-1 animate-slide-down">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-[#2C1952] text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-[#5D3BE7] hover:text-[#4A2EC0] transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8C8C9E]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-[#FF6B6B]' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D3BE7]/50 transition-all`}
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-[#FF6B6B] text-sm mt-1 animate-slide-down">{errors.password.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#5D3BE7] text-white py-3 px-4 rounded-lg focus:outline-none hover:bg-[#4A2EC0] transition-all duration-300 transform hover:translate-y-[-2px] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#8C8C9E]">
              Don't have an account? 
              <Link to="/register" className="text-[#5D3BE7] font-semibold hover:text-[#4A2EC0] transition-colors ml-1">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 