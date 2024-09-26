import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';


const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, recaptchaToken}) 
      });
      const data = await response.json();
      if (response.ok) {
        // navigate('/login');
        setMessage(data.message || 'Registration successful. Please check your email to verify your account.');
        setIsRegistered(true);
        setResendEmail(email);
        // Clear the form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Verification email resent. Please check your inbox.');
      } else {
        setError(data.message || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('Failed to resend verification email');
    }
  };

  return (
    <div 
    className="flex flex-col items-center md:justify-center min-h-screen relative"
    style={{
      backgroundImage: "url(/bsas2.webp)",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
  }}
    >
       <Link to='/' className='text-4xl mt-12 bg-transparent p-2 rounded  hover:text-gray-700 md:absolute md:top-4 md:left-10'>Tremendo</Link>
      <div className='flex flex-col w-full max-w-sm bg-white p-6 rounded shadow-xl opacity-90'>
       
        <h1 className="text-2xl mb-4">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {!isRegistered ? (

          <form onSubmit={handleRegister} className="">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full rounded"
                required
              />
              {passwordMismatch && <p className="text-red-500 mt-2">Passwords do not match!</p>}
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                Show Password
              </label>
            </div>
            <div className="mb-4">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setRecaptchaToken}
              />
            </div>
            <div className='w-full flex items-center justify-center mb-4'>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Register
              </button>
            </div>
          </form>
         ) : ( 
            <div>
              <p className="mb-4">Registration successful! Please check your email to verify your account.</p>
              <form onSubmit={handleResendVerification} className="mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email for Verification</label>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="border border-gray-300 px-3 py-2 w-full rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                  Resend Verification Email
                </button>
              </form>
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                Go to Login
              </Link>
            </div>
          )}
        
        <span className=''>Already have an account? <Link to='/login' className='text-blue-600 hover:text-sky-500'>Login</Link> </span>
        <p className="mt-2">
          Didn't receive a verification email?  &nbsp;
          <span 
            className="text-blue-500 cursor-pointer" 
            onClick={() => setShowResendForm(true)}
          >
            Resend
          </span>
        </p>
        {showResendForm && (
          <form onSubmit={handleResendVerification} className="mt-4">
            <label htmlFor="resendEmail" className="block text-sm font-medium text-gray-700">
              Enter your email:
            </label>
            <input
              type="email"
              id="resendEmail"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Resend Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;