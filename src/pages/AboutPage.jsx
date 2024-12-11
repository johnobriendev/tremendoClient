import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings} className="w-2/3 mx-auto">
      <div>
        <img className="w-full h-auto" src="screenshot3.png" alt="Screenshot 3" />
      </div>
      <div>
        <img className="w-full h-auto" src="screenshot1.png" alt="Screenshot 1" />
      </div>
      <div>
        <img className="w-full h-auto" src="screenshot2.png" alt="Screenshot 2" />
      </div>
    </Slider>
  );
};


const AboutPage = () => {
  return (
    <div 
    className="flex flex-col min-h-screen text-white p-8 overflow-auto relative"
    style={{
      // backgroundImage: "url(/beach.jpg)",
      backgroundImage: "url(/mountain.jpg)",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
  }}
    >
      <Link to='/' className='text-lg mt-4 bg-transparent p-2 rounded absolute top-4 left-10 hover:text-gray-300'>Tremendo</Link>
      <h1 className="text-4xl font-semibold mb-4 mt-24 xl:mt-12 2xl:mt-12 xl:mb-24 md:mx-24 xl:mx-72">Welcome to Tremendo</h1>
      <p className='md:mx-24 xl:mx-72 mb-8 md:text-lg text-black bg-slate-100 bg-opacity-50 rounded p-4'>Tremendo is the ultimate productivity tool designed to help you manage tasks effortlessly. Tremendo offers a clean and intuitive interface where you can create boards, organize lists, and keep track of your tasks all in one place. Whether you're managing personal to-dos or working on team projects, its flexible drag-and-drop system makes task management seamless. Customize your workflow, stay organized, and increase your productivity with powerful features that adapt to your needs. Get started with Tremendo and take control of your day! </p>
      
      <ul className='md:mx-24 xl:mx-72 mb-8 md:text-lg list-disc text-black bg-slate-100 bg-opacity-50 rounded p-4'>
        <p className='bg-opacity-50 rounded font-semibold'>Users can:</p>
        <div className='ml-4'>
          <li>Create and Edit Boards</li>
          <li>Select between light and darks themes and different background images</li>
          <li>Create, Edit, and Delete Lists</li>
          <li>Create, Edit, and Delete Cards</li>
          <li>Drag and Drop Cards between lists</li>
        </div>
      </ul>

      {/* Mobile View: Stacked Images */}
      <div className="block md:hidden space-y-4">
        <img className="w-full h-auto" src="screenshot3.png" alt="Screenshot 3" />
        <img className="w-full h-auto" src="screenshot1.png" alt="Screenshot 1" />
        <img className="w-full h-auto" src="screenshot2.png" alt="Screenshot 2" />
      </div>
      
      {/* Medium and Larger Screens: Carousel */}
      <div className="hidden md:block">
        <Carousel />
      </div>

      <div className="flex space-x-4 my-16 mx-auto">
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

export default AboutPage;