import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { LeafIcon, EyeIcon, EyeOffIcon } from '../components/icons';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const { navigate } = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    // Role defaults to 'worker' on the backend
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name] || errors.detail || errors.confirmPassword) { // Clear specific or general error on change
        setErrors(prev => ({...prev, [e.target.name]: null, detail: null, confirmPassword: null}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let currentErrors = {};
    if (formData.password !== formData.confirmPassword) {
      currentErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.username) currentErrors.username = "Username is required.";
    if (!formData.email) currentErrors.email = "Email is required.";
    if (!formData.password) currentErrors.password = "Password is required.";
    
    if (Object.keys(currentErrors).length > 0) {
        setErrors(currentErrors);
        return;
    }
    setErrors({});


    const { confirmPassword, ...userData } = formData; 
    const result = await register(userData);

    if (result === true) {
      // Navigate to login page for the user to sign in
      navigate('login'); 
    } else if (result && result.success === false && result.errors) {
      // Handle specific field errors from backend
      const backendErrors = {};
      for (const key in result.errors) {
        backendErrors[key] = Array.isArray(result.errors[key]) ? result.errors[key].join(' ') : result.errors[key];
      }
      setErrors(backendErrors);
    } else {
      setErrors({ detail: 'Registration failed. An unknown error occurred.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 p-4 font-inter">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <LeafIcon className="w-16 h-16 text-green-500 mb-3" />
          <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
          <p className="text-center text-gray-600 mt-1">Join AgriSync Lite today!</p>
        </div>

        {errors.detail && <p className="bg-red-100 text-red-700 p-3.5 rounded-md mb-5 text-sm shadow-sm border border-red-200">{errors.detail}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="first_name">First Name</label>
              <input className={`form-input ${errors.first_name ? 'border-red-500' : ''}`} id="first_name" name="first_name" type="text" placeholder="John" value={formData.first_name} onChange={handleChange} required/>
              {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="last_name">Last Name</label>
              <input className={`form-input ${errors.last_name ? 'border-red-500' : ''}`} id="last_name" name="last_name" type="text" placeholder="Doe" value={formData.last_name} onChange={handleChange} required />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="username">Username <span className="text-red-500">*</span></label>
            <input className={`form-input ${errors.username ? 'border-red-500' : ''}`} id="username" name="username" type="text" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="email">Email <span className="text-red-500">*</span></label>
            <input className={`form-input ${errors.email ? 'border-red-500' : ''}`} id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="password">Password <span className="text-red-500">*</span></label>
            <div className="relative">
                <input className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`} id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-green-500">
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5" htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></label>
             <div className="relative">
                <input className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`} id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-green-500">
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <style jsx>{`
            .form-input {
                @apply shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow duration-150;
            }
          `}</style>

          <div>
            <button
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 w-full transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('login')} 
            className="font-semibold text-green-600 hover:text-green-700 hover:underline focus:outline-none focus:ring-1 focus:ring-green-500 rounded"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;