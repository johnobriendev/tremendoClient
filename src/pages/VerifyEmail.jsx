import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const location = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);


  useEffect(() => {
    const verifyEmail = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setIsSuccess(true);
          setVerificationStatus(data.message);
        } else {
          setIsSuccess(false);
          setVerificationStatus(data.message || 'Email verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setIsSuccess(false);
        setVerificationStatus('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">Email Verification</h1>
        <p className={`text-lg ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {verificationStatus}
        </p>
        {isSuccess && (
          <p className="mt-4">
            You can now <a href="/login" className="text-blue-600 hover:underline">login to your account</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;