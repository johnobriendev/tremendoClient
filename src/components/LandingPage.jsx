import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div 
    className="flex flex-col items-center  min-h-screen p-2"
    style={{
        // backgroundImage: "url(/bsas3.webp)",
        backgroundImage: "url(/beach.jpg)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
    }}
    >
      <h1 className="text-white text-4xl font-semibold mb-4 mt-24 xl:mt-12 2xl:mt-24">Tremendo</h1>
      <h2 className="text-white mb-8 text-center w-full">Your go-to solution for everything you need related to productivity and organization.</h2>
      <Link to='/about' className='text-xl border rounded px-4 py-2 bg-slate-100 bg-opacity-80'>Learn More</Link>
      <div className="flex space-x-4 mt-8">
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