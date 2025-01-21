import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DemoBoard from '../components/DemoBoard';
import { useTheme } from '../context/ThemeContext';
import { Layout, Users, Sparkles, Move, UserCircle } from 'lucide-react';




const LandingPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
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
        <nav className={`flex ${isScrolled ? 'justify-between' : 'justify-end'}  items-center max-w-7xl mx-auto`}>
          <a href="#" onClick={scrollToTop} className={`text-4xl font-bold ${isScrolled ? 'text-black font-thin' : 'hidden'}`}>
            Tremendo
          </a>
          <div className="space-x-4">
            <a href="#about" onClick={scrollToAbout} className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
              About
            </a>
            <a href="#demo" onClick={scrollToDemo} className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
              Demo
            </a>
            <Link to="/login" className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
              Login
            </Link>
            <Link to="/register" className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
              Register
            </Link>
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
        <section id="about" className="min-h-screen flex flex-col items-center justify-center py-24 bg-white">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-4xl md:text-5xl font-thin mb-8">Where Tasks Find Their Flow</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Tremendo brings clarity to task management through beautifully simple design. Our clean, intuitive interface helps you organize work without the clutter, letting you focus on what matters most.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Visualize Your Work</h3>
                <p className="text-gray-600">See your projects come to life with our intuitive board layout</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Team Collaboration</h3>
                <p className="text-gray-600">Work together seamlessly with real-time updates and sharing</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Beautiful Interface</h3>
                <p className="text-gray-600">Enjoy a clean, modern design that makes productivity beautiful</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen bg-gray-50 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16">Features You'll Love</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-medium mb-4 flex items-center">
                    <Layout className="w-6 h-6 text-blue-600 mr-2" />
                    Simple Board Creation
                  </h3>
                  <p className="text-gray-600">
                    Set up dedicated spaces for different projects in seconds. Our intuitive interface makes creating and organizing boards effortless, so you can focus on what matters most.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium mb-4 flex items-center">
                    <Move className="w-6 h-6 text-blue-600 mr-2" />
                    Drag-and-Drop Magic
                  </h3>
                  <p className="text-gray-600">
                    Move tasks between lists with simple drag-and-drop functionality. Watch your workflow come to life as you organize and prioritize with natural, intuitive gestures.
                  </p>
                </div>
                {/* Add more feature items here */}
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg"></div>
                <img 
                  src="/feature-screenshot.png" 
                  alt="Tremendo board interface" 
                  className="rounded-lg shadow-xl relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="min-h-screen bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16">Built for Your Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Personal Projects</h3>
                <p className="text-gray-600">
                  Stay organized and focused with personal task boards. Track your goals, habits, and daily tasks with ease.
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Team Projects</h3>
                <p className="text-gray-600">
                  Collaborate seamlessly with your team. Share boards, assign tasks, and keep everyone aligned with minimal effort.
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layout className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Project Management</h3>
                <p className="text-gray-600">
                  Perfect for managing complex projects. Break down big goals into manageable tasks and track progress effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <h2 className="text-5xl md:text-6xl font-thin mb-8 text-white">Ready to Transform Your Workflow?</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of teams who have already discovered a better way to manage their tasks and projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium min-w-[200px]"
              >
                Start Free Trial
              </Link>
              <a 
                href="#demo" 
                onClick={scrollToDemo}
                className="bg-blue-500 bg-opacity-20 text-white border border-white/30 px-8 py-4 rounded-lg hover:bg-opacity-30 transition-colors text-lg font-medium min-w-[200px]"
              >
                Try Demo
              </a>
            </div>
            <div className="mt-12 flex justify-center space-x-12 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10k+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50k+</div>
                <div className="text-sm">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">99%</div>
                <div className="text-sm">Satisfaction</div>
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
            {/* <h2 className="text-3xl md:text-4xl font-thin text-center mb-4">
              Try Our Demo Board
            </h2>
            <p className="text-center text-lg mb-4 px-4">
              Experience Tremendo's features without creating an account
            </p> */}
            <div className="w-full overflow-hidden">
              <DemoBoard />
            </div>
          </div>
        </section>

      
      </main>

      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Company</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">About Us</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Careers</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Press</Link>
            
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Resources</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Blog</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Help Center</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">FAQ</Link>
            
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Legal</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Terms of Service</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Privacy Policy</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Cookie Policy</Link>
            
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className="font-semibold mb-2">Connect</h3>
            
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Twitter</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">Facebook</Link>
              <Link to='/workinprogress' className="text-sm text-gray-600 hover:underline">LinkedIn</Link>
            
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
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




//  <section id="about" className="min-h-screen flex flex-col items-center justify-center p-16 bg-cover bg-center overflow-auto relative" style={{backgroundImage: "url(/mountain.jpg)"}}>
//  <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-lg p-8 shadow-lg">
//   <div className="space-y-6">
//      <p className="text-lg">
//        Tremendo brings clarity to task management through beautifully simple design. Our clean, intuitive interface helps you organize work without the clutter, letting you focus on what matters most.
//      </p>
     
//      <p className="text-lg">
//        Whether you're planning personal projects or coordinating with a team, Tremendo adapts to your needs. Create boards that reflect your workflow, organize tasks into lists, and track progress with a quick glance. With smooth drag-and-drop functionality, managing tasks feels natural and effortless.
//      </p>

//      <h3 className="text-xl font-semibold">Core Features:</h3>
//      <ul className="list-disc pl-6 space-y-3">
//        <li className="text-lg">
//          <span className="font-medium">Simple Board Creation:</span> Set up dedicated spaces for different projects or areas of focus
//        </li>
//        <li className="text-lg">
//          <span className="font-medium">Flexible Task Organization:</span> Create, move, and update tasks with intuitive drag-and-drop functionality
//        </li>
//        <li className="text-lg">
//          <span className="font-medium">Clean Visual Design:</span> Choose between light and dark themes, and personalize your boards with custom backgrounds
//        </li>
//        <li className="text-lg">
//          <span className="font-medium">Seamless Collaboration:</span> Share boards, assign tasks, and keep everyone aligned with minimal effort
//        </li>
//      </ul>
//    </div>

//    <div className="block md:hidden space-y-4 md:mx-24 xl:mx-72">
//      <img
//        className="w-full h-auto rounded shadow-lg"
//        src="screenshot3.png"
//        alt="Screenshot 3"
//        onClick={() => setEnlargedImage("screenshot3.png")}
//      />
//      <img
//        className="w-full h-auto rounded shadow-lg"
//        src="screenshot1.png"
//        alt="Screenshot 1"
//        onClick={() => setEnlargedImage("screenshot1.png")}
//      />
//      <img
//        className="w-full h-auto rounded shadow-lg"
//        src="screenshot2.png"
//        alt="Screenshot 2"
//        onClick={() => setEnlargedImage("screenshot2.png")}
//      />
//    </div>

//    {/* Desktop View: Carousel */}
//    <div className="hidden md:block ">
//      <Slider {...settings}>
//        {['screenshot3.png', 'screenshot1.png', 'screenshot2.png'].map((src, index) => (
//          <div key={index} className="focus:outline-none">
//            <img
//              className="w-full h-auto rounded shadow-lg cursor-pointer"
//              src={src}
//              alt={`Screenshot ${index + 1}`}
//              onClick={() => setEnlargedImage(src)}
//            />
//          </div>
//        ))}
//      </Slider>
//    </div>
//    <div className="flex justify-center space-x-4 mt-8">
//      <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//        Register
//      </Link>
//      <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//        Login
//      </Link>
//    </div>
//  </div>
// </section>
