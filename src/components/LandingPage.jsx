import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Cello</h1>
      <p className="mb-6">Your go-to solution for everything you need.</p>
      <div className="flex space-x-4">
        <Link to="/register">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        </Link>
        <Link to="/login">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;