import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DemoBoard from '../components/DemoBoard';
import { useTheme } from '../context/ThemeContext';
import { Layout, Users, Sparkles, Move, UserCircle, Menu, X } from 'lucide-react';




const LandingPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const { colors } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToAbout = (e) => {
    e.preventDefault()
    const aboutSection = document.getElementById('about')
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToDemo = (e) => {
    e.preventDefault()
    const demoSection = document.getElementById('demo')
    const offset = 60 // Approximate height of your header in pixels
    const elementPosition = demoSection.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
  
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  // const scrollToDemo = (e) => {
  //   e.preventDefault()
  //   const demoSection = document.getElementById('demo')
  //   demoSection.scrollIntoView({ behavior: 'smooth' })
  // }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <div className="flex flex-col min-h-screen">

      <header className={`w-full py-4 px-6 fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <nav className={`flex ${isScrolled ? 'justify-between' : 'justify-end'} items-center max-w-7xl mx-auto`}>
          <a 
            href="#" 
            onClick={scrollToTop} 
            className={`text-4xl font-bold ${isScrolled ? 'text-black font-thin' : 'hidden'}`}
          >
            Tremendo
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <a 
              href="#about" 
              onClick={scrollToAbout} 
              className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              About
            </a>
            <a 
              href="#demo" 
              onClick={scrollToDemo} 
              className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              Demo
            </a>
            <Link 
              to="/login" 
              className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${isScrolled ? 'text-black' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Mobile Menu Overlay */}
          <div 
            className={`fixed md:hidden inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Navigation */}
          <div 
            className={`fixed md:hidden top-[72px] right-0 w-64 bg-white/95 backdrop-blur-md h-screen transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col space-y-4 p-6">
              <a 
                href="#about" 
                onClick={(e) => {
                  scrollToAbout(e);
                  setIsMobileMenuOpen(false);
                }} 
                className="text-black text-sm font-medium hover:underline"
              >
                About
              </a>
              <a 
                href="#demo" 
                onClick={(e) => {
                  scrollToDemo(e);
                  setIsMobileMenuOpen(false);
                }} 
                className="text-black text-sm font-medium hover:underline"
              >
                Demo
              </a>
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-black text-sm font-medium hover:underline"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-black text-sm font-medium hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      </header>

      
        

      <main className="flex-grow">
        <section
          className="h-screen flex flex-col items-center justify-items-start p-6 bg-cover bg-center"
          style={{
            backgroundImage: "url(/playa.webp)",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-thin  text-white mb-4 mt-24 text-center">Tremendo</h1>
          <div className="space-y-4">
            <a href="#about" onClick={scrollToAbout} className="bg-white bg-opacity-40 hover:bg-opacity-50 hover:border hover:border-white text-white font-thin py-2 px-4 rounded">
              Learn More
            </a>
            <a href="#demo" onClick={scrollToDemo} className="block text-center text-white hover:underline">
                Try the Demo
            </a>
          </div>
        </section>

        {/* Overview Section */}
        <section id="about" className="min-h-screen flex flex-col items-center justify-center py-24 bg-gradient-to-b from-slate-700 to-slate-600">
          <div className="max-w-6xl mx-auto text-center px-4">
            {/* Main heading and description */}
            <h2 className="text-4xl md:text-5xl font-thin mb-8 text-white">Where Tasks Find Their Flow</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              Tremendo brings clarity to task management through beautifully simple design. Our clean, intuitive interface helps you organize work without the clutter, letting you focus on what matters most.
            </p>
            
            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-8 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Visualize Your Work</h3>
                <p className="text-slate-300">See your projects come to life with our intuitive board layout</p>
              </div>

              <div className="p-8 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Team Collaboration</h3>
                <p className="text-slate-300">Work together seamlessly with real-time updates and sharing</p>
              </div>

              <div className="p-8 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-700">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">Beautiful Interface</h3>
                <p className="text-slate-300">Enjoy a clean, modern design that makes productivity beautiful</p>
              </div>
            </div>
          </div>
        </section>
      

        {/* Features Section */}
        <section id='features' className="min-h-screen bg-gradient-to-b from-slate-600 to-slate-800 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16 text-white">Features You'll Love</h2>
            
            {/* Demo Video */}
            <div className="mb-16">
              <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl border border-slate-700">
                <video
                  className="w-full"
                  controls
                  autoPlay
                  muted
                  loop
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left column with feature descriptions */}
              <div className="space-y-12">
                <div className="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h3 className="text-2xl font-medium mb-4 flex items-center text-white">
                    <Layout className="w-6 h-6 text-blue-400 mr-2" />
                    Board Organization
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Create and manage multiple boards for different projects or areas of focus. Each board becomes a dedicated space for your team to collaborate and track progress.
                  </p>
                </div>
                
                <div className="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h3 className="text-2xl font-medium mb-4 flex items-center text-white">
                    <Move className="w-6 h-6 text-blue-400 mr-2" />
                    Task Management
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Drag and drop tasks between lists with ease. Add labels, due dates, and detailed descriptions to keep everything organized and accessible.
                  </p>
                </div>
              </div>

              {/* Right column with feature highlights */}
              <div className="space-y-12">
                <div className="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h3 className="text-2xl font-medium mb-4 flex items-center text-white">
                    <Users className="w-6 h-6 text-blue-400 mr-2" />
                    Team Collaboration
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Share boards, assign tasks, and keep everyone aligned with minimal effort. Real-time updates ensure your team stays in sync.
                  </p>
                </div>

                <div className="p-6 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h3 className="text-2xl font-medium mb-4 flex items-center text-white">
                    <Sparkles className="w-6 h-6 text-blue-400 mr-2" />
                    Beautiful Interface
                  </h3>
                  <p className="text-slate-300 mb-4">
                    A clean, modern design that makes productivity beautiful. Customize your workspace with labels, colors, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
       

        {/* Workflow Section */}
        <section className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16 text-white">Built for Your Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-700">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">Personal Projects</h3>
                <p className="text-slate-300">
                  Stay organized and focused with personal task boards. Track your goals, habits, and daily tasks with ease.
                </p>
              </div>
              <div className="text-center p-8 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-700">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">Team Projects</h3>
                <p className="text-slate-300">
                  Collaborate seamlessly with your team. Share boards, assign tasks, and keep everyone aligned with minimal effort.
                </p>
              </div>
              <div className="text-center p-8 bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-700">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layout className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">Project Management</h3>
                <p className="text-slate-300">
                  Perfect for managing complex projects. Break down big goals into manageable tasks and track progress effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="relative min-h-screen py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900"></div>
          {/* Modified CTA content below */}
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <h2 className="text-5xl md:text-6xl font-thin mb-8 text-white">Ready to Transform Your Workflow?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Experience a better way to organize your work and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to="/register" 
                className="bg-white text-blue-900 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium min-w-[200px]"
              >
                Start Free Trial
              </Link>
              <a 
                href="#demo" 
                onClick={scrollToDemo}
                className="bg-blue-800 bg-opacity-20 text-white border border-white/30 px-8 py-4 rounded-lg hover:bg-opacity-30 transition-colors text-lg font-medium min-w-[200px]"
              >
                Try Demo
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Intuitive Design</h3>
                <p className="text-blue-100">Get started in minutes with our user-friendly interface. No complex setups or learning curves.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Real-time Updates</h3>
                <p className="text-blue-100">See changes instantly as you and your team work together. Stay in sync, always.</p>
              </div>
            </div>
          </div>
        </section>


        <section 
          id="demo" 
          className="min-h-screen relative bg-gray-100 dark:bg-gray-800  overflow-hidden"
          style={{
            backgroundColor: '#1e293b',
            color: '#e6eaee',
          }}
        >
          <div className="relative z-10">
            <div className="w-full overflow-hidden">
              <DemoBoard />
            </div>
          </div>
        </section>

      
      </main>

      <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Company</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">About Us</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Careers</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Press</Link>
            
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Resources</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Blog</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Help Center</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">FAQ</Link>
            
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Legal</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Terms of Service</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Privacy Policy</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Cookie Policy</Link>
            
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Connect</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Twitter</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">Facebook</Link>
              <Link to='/workinprogress' className="text-sm text-gray-500 hover:underline">LinkedIn</Link>
            
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Tremendo. All rights reserved.
        </div>
      </footer>

      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setEnlargedImage(null)}
        >
          <img src={enlargedImage} alt="Enlarged view" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  )
}


 export default LandingPage;




// <header className={`w-full py-4 px-6 fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'}`}>
//         <nav className={`flex ${isScrolled ? 'justify-between' : 'justify-end'}  items-center max-w-7xl mx-auto`}>
//           <a href="#" onClick={scrollToTop} className={`text-4xl font-bold ${isScrolled ? 'text-black font-thin' : 'hidden'}`}>
//             Tremendo
//           </a>
//           <div className="space-x-4">
//             <a href="#about" onClick={scrollToAbout} className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
//               About
//             </a>
//             <a href="#demo" onClick={scrollToDemo} className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
//               Demo
//             </a>
//             <Link to="/login" className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
//               Login
//             </Link>
//             <Link to="/register" className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
//               Register
//             </Link>
//           </div>
//         </nav>
//       </header>