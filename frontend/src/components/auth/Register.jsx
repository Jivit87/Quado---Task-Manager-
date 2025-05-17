import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import registerImg from "../../assets/register.svg";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { name, email, password, confirmPassword } = formData;
  
  const { auth, register, clearErrors } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
    
    if (auth.error) {
      toast.error(auth.error);
    }
    
    return () => {
      clearErrors();
    };
  }, [auth.isAuthenticated, auth.error, navigate, clearErrors]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (auth.error) {
      clearErrors();
    }
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }
    
    setFormErrors({});
    setIsLoading(true);
    
    const success = await register({
      name,
      email,
      password
    });
    
    setIsLoading(false);
    
    if (success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(auth.error || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">

      <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-[#00FF85] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              Quado
            </span>
          </Link>
        </div>
      </header>
      

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-6">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl rounded-xl bg-[#1A1A1A] shadow-lg">

          <div className="hidden md:block lg:w-1/2 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col justify-center h-full">
              <div className="mb-4 sm:mb-6">
                <img 
                  src={registerImg} 
                  alt="Registration" 
                  className="mx-auto rounded-lg"
                />
              </div>
            </div>
          </div>
          

          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Create Your Account
                </h2>
                <p className="text-sm sm:text-base text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                  Start managing your time effectively today
                </p>
              </div>
              
              {auth.error && (
                <div className="p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg bg-[#FF2965] bg-opacity-20 text-[#FF2965] border border-[#FF2965] border-opacity-40">
                  {auth.error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      className="appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 pl-10 sm:pl-11 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85] bg-[#2A2A2A] text-white border-[#677475]"
                      style={{ 
                        borderColor: formErrors.name ? '#FF2965' : '#677475',
                        boxShadow: formErrors.name ? '0 0 0 2px rgba(255, 41, 101, 0.2)' : 'none',
                        fontFamily: "'system-ui', sans-serif"
                      }}
                      id="name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-[#A3B1B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.name && (
                    <p className="text-xs mt-1 text-[#FF2965]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                      {formErrors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      className="appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 pl-10 sm:pl-11 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85] bg-[#2A2A2A] text-white border-[#677475]"
                      style={{ 
                        borderColor: formErrors.email ? '#FF2965' : '#677475',
                        boxShadow: formErrors.email ? '0 0 0 2px rgba(255, 41, 101, 0.2)' : 'none',
                        fontFamily: "'system-ui', sans-serif"
                      }}
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-[#A3B1B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.email && (
                    <p className="text-xs mt-1 text-[#FF2965]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                      {formErrors.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 pl-10 sm:pl-11 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85] bg-[#2A2A2A] text-white border-[#677475]"
                      style={{ 
                        borderColor: formErrors.password ? '#FF2965' : '#677475',
                        boxShadow: formErrors.password ? '0 0 0 2px rgba(255, 41, 101, 0.2)' : 'none',
                        fontFamily: "'system-ui', sans-serif"
                      }}
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="•••••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-[#A3B1B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs mt-1 text-[#FF2965]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                      {formErrors.password}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className="appearance-none border rounded-lg w-full py-2 sm:py-3 px-3 sm:px-4 pl-10 sm:pl-11 text-sm sm:text-base leading-tight focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:border-[#00FF85] bg-[#2A2A2A] text-white border-[#677475]"
                      style={{ 
                        borderColor: formErrors.confirmPassword ? '#FF2965' : '#677475',
                        boxShadow: formErrors.confirmPassword ? '0 0 0 2px rgba(255, 41, 101, 0.2)' : 'none',
                        fontFamily: "'system-ui', sans-serif"
                      }}
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="•••••••••••"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-[#A3B1B2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-xs mt-1 text-[#FF2965]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
                
                <div className="!mt-6 sm:!mt-8">
                  <button
                    className="w-full font-medium py-2 sm:py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] transition-all bg-[#00FF85] text-[#0A0A0A] hover:bg-opacity-90 shadow-md"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    type="submit"
                    disabled={isLoading || auth.loading}
                  >
                    {isLoading || auth.loading ? (
                      <svg className="animate-spin h-5 w-5 text-[#0A0A0A] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-4 sm:mt-6 flex justify-center items-center space-x-2">
                <span className="text-xs sm:text-sm text-[#A3B1B2]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                  Already have an account?
                </span>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-[#AF52DE] hover:text-[#AF52DE] hover:brightness-110 transition-colors"
                  style={{ fontFamily: "'system-ui', sans-serif" }}
                >
                  Sign In
                </Link>
              </div>
              
              <div className="text-center mt-3 text-xs text-[#677475]" style={{ fontFamily: "'system-ui', sans-serif" }}>
                <p>
                  By signing up, you agree to our{' '}
                  <a href="#" className="underline hover:text-[#A3B1B2] transition-colors text-[#A3B1B2]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline hover:text-[#A3B1B2] transition-colors text-[#A3B1B2]">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;