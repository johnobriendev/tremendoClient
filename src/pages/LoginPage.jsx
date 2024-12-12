import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginUser } from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    // Clear any existing errors when starting validation
    setError('');

    // Check if email is empty
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    // Check email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check if password is empty
    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Use our API function instead of direct fetch
      const data = await loginUser({ email, password });
      
      // Store the token and navigate on success
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
      
    } catch (error) {
      // Handle different error cases
      switch (error.message) {
        case 'Please verify your email before logging in':
          setError('Please verify your email address to login. Check your inbox for the verification email.');
          break;
        case 'Invalid email or password':
          setError('Incorrect email or password. Please try again.');
          break;
        default:
          setError(error.message || 'Unable to log in. Please try again.');
      }
    }
  };

  
  return (
    <div 
    className="flex flex-col items-center justify-center min-h-screen"
    style={{
      backgroundImage: "url(/bsas4.webp)",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
    }}
    >
      <div className='w-full max-w-sm bg-white p-6 rounded shadow-xl flex flex-col opacity-90'>
        <Link to='/' className='text-4xl mt-12 bg-transparent p-2 rounded absolute top-4 left-10 text-gray-200 hover:text-gray-400'>Tremendo</Link>
        <h1 className="text-2xl mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} noValidate className="mb-4">
          <div className="mb-4">
            <label htmlFor='login-email' className="block text-gray-700 mb-2">Email</label>
            <input
              id='login-email'
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); 
              }}
              className="border border-gray-300 px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor='login-password' className="block text-gray-700 mb-2">Password</label>
            <input
              id='login-password'
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); 
              }}
              className="border border-gray-300 px-3 py-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                  aria-label="Show password"
                />
                Show Password
              </label>
            </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
        <Link to='/forgot-password' className='text-blue-600 hover:text-sky-500'>Forgot password?</Link>
        
        <span className=''>Don't have an account? <Link to='/register' className='text-blue-600 hover:text-sky-500'>Sign up!</Link> </span>
      </div>
      
    </div>
  );
};

export default LoginPage;


// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password })
//     });
//     if (response.ok) {
//       const data = await response.json();
//       localStorage.setItem('token', data.token);
//       navigate('/dashboard');
//     } else {
//       const data = await response.json();
//       switch (data.message) {
//         case 'Please verify your email before logging in':
//           setError('Please verify your email address to login. Check your inbox for the verification email.');
//           break;
//         case 'Invalid email or password':
//           setError('Incorrect email or password. Please try again.');
//           break;
//         default:
//           setError(data.message || 'Unable to log in. Please try again. Contact johnobrien.dev@gmail.com if you continue having issues.');
//       }
//     }
//   } catch (err) {
//     setError('Login failed');
//   }
// };
