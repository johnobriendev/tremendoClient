import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div 
    className="flex flex-col items-center  min-h-screen bg-slate-400"
    >
      <Link to='/' className='text-lg mt-12 bg-transparent p-2 rounded absolute top-4 left-10 hover:text-gray-800'>Tremendo</Link>
      <h1 className="text-4xl font-semibold mb-4 mt-24 xl:mt-12 2xl:mt-24 xl:mb-24">Welcome to Tremendo</h1>
      <p className='md:mx-24 xl:mx-72 mb-12'>Tremendo is he ultimate productivity tool designed to help you manage tasks effortlessly. Tremendo offers a clean and intuitive interface where you can create boards, organize lists, and keep track of your tasks all in one place. Whether you're managing personal to-dos or working on team projects, its flexible drag-and-drop system makes task management seamless. Customize your workflow, stay organized, and increase your productivity with powerful features that adapt to your needs. Get started with Tremendo and take control of your day! </p>
      <img className='w-2/3 h-auto mb-4'  src="screenshot3.png" alt="" />
      <img className='w-2/3 h-auto mb-4' src="screenshot1.png" alt="" />
      <img className='w-2/3 h-auto mb-4'  src="screenshot2.png" alt="" />
      
      
    </div>
  );
};

export default AboutPage;