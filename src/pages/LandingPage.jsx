import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Layout, Users, Sparkles, Move, UserCircle, Menu, X, 
  Code, Brain, Book, Workflow, Columns, Zap } from 'lucide-react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DemoBoard from '../components/DemoBoard';
import { useTheme } from '../context/ThemeContext';





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
          <p className="text-l md:text-xl text-white font-light max-w-2xl mx-auto text-center">
            Simplify your workflow. Visualize your progress.
            The project management tool that works the way you think.
          </p>
          <div className=" flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link 
              to="/register" 
              className="w-48 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
            <button 
              onClick={scrollToAbout}
              className="w-48 bg-white/10 hover:bg-white/20 text-white border border-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Learn More
            </button>
            <button 
              onClick={scrollToDemo}
              className="w-48 bg-white hover:bg-white/90 text-blue-900 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Try Demo
            </button>
          </div>
         
        </section>

          {/*workflow simplification section  */}
        <section id='about' className="min-h-screen bg-gradient-to-b from-slate-600 to-slate-800 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16 text-white">
              Simplify Your Project Organization
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform transition-transform group-hover:scale-105 opacity-0 group-hover:opacity-100 -z-10" />
                <div className="bg-slate-700/50 backdrop-blur p-8 rounded-lg border border-slate-600 transition-transform group-hover:border-white">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                    <Workflow className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-white">Visual Organization</h3>
                  <p className="text-slate-300">
                    Transform complex projects into clear, visual workflows. Drag and drop tasks to instantly update progress and keep everyone aligned.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform transition-transform group-hover:scale-105 opacity-0 group-hover:opacity-100 -z-10" />
                <div className="bg-slate-700/50 backdrop-blur p-8 rounded-lg border border-slate-600 transition-transform group-hover:border-white">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                    <Columns className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-white">Flexible Workflows</h3>
                  <p className="text-slate-300">
                    Customize boards to match your process. Create lists that reflect your workflow stages and adapt as your needs change.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transform transition-transform group-hover:scale-105 opacity-0 group-hover:opacity-100 -z-10" />
                <div className="bg-slate-700/50 backdrop-blur p-8 rounded-lg border border-slate-600 transition-transform group-hover:border-white">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-white">Instant Updates</h3>
                  <p className="text-slate-300">
                    See changes in real-time as you and your team collaborate. No more out-of-date information or missed updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10 rounded-2xl" />
              <div className="relative bg-slate-700/50 backdrop-blur p-8 md:p-12 rounded-2xl border border-slate-600">
                <h3 className="text-2xl md:text-3xl font-thin text-white mb-6">
                  From Chaos to Clarity
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xl text-white font-medium">Before Tremendo</h4>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center">
                        <span className="text-red-400 mr-2">✕</span>
                        Scattered tasks across multiple tools
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-400 mr-2">✕</span>
                        Unclear project status and priorities
                      </li>
                      <li className="flex items-center">
                        <span className="text-red-400 mr-2">✕</span>
                        Time lost in status update meetings
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl text-white font-medium">With Tremendo</h4>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        All tasks organized in one visual space
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Real-time progress tracking
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        Efficient team collaboration
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        

       
      

        {/* Features Section */}
        {/* <section id="features" className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16 text-white">
              See Tremendo in Action
            </h2>
            
            <div className="max-w-6xl mx-auto mb-16">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-slate-700">
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
          </div>
        </section> */}
        <section id="features" className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-8 md:mb-16 text-white">
              See Tremendo in Action
            </h2>
            
            <div className="max-w-6xl mx-auto mb-8 md:mb-16">
              <div className="rounded-lg overflow-hidden shadow-xl border border-slate-700">
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

            {/* Feature highlights for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  title: "Task Management",
                  description: "Create, organize, and track tasks with intuitive drag-and-drop interfaces"
                },
                {
                  title: "Real-time Updates",
                  description: "See changes instantly as your team collaborates on projects"
                },
                {
                  title: "Customizable Workflow",
                  description: "Adapt boards and lists to match your team's unique process"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-slate-700/30 backdrop-blur p-6 rounded-lg border border-slate-600"
                >
                  <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                  <p className="text-slate-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
       

        {/* Workflow Section */}
        <section id="use-cases" className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-thin text-center mb-16 text-white">
              Built for Every Process
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Code className="w-6 h-6 text-blue-400" />,
                  title: "Software Development",
                  description: "Perfect for agile development teams managing sprints and feature releases.",
                  features: [
                    "Sprint planning and backlog management",
                    "Bug tracking and feature development",
                    "Code review and deployment workflows"
                  ]
                },
                {
                  icon: <Users className="w-6 h-6 text-blue-400" />,
                  title: "Team Projects",
                  description: "Streamline collaboration and keep everyone aligned on team objectives.",
                  features: [
                    "Task delegation and progress tracking",
                    "Team communication and updates",
                    "Resource allocation and scheduling"
                  ]
                },
                {
                  icon: <Brain className="w-6 h-6 text-blue-400" />,
                  title: "Personal Productivity",
                  description: "Organize your personal tasks and projects with clarity and purpose.",
                  features: [
                    "Daily task management and priorities",
                    "Goal tracking and habit building",
                    "Personal project organization"
                  ]
                },
                {
                  icon: <Book className="w-6 h-6 text-blue-400" />,
                  title: "Content Planning",
                  description: "Manage your content calendar and creative workflows efficiently.",
                  features: [
                    "Editorial calendar management",
                    "Content creation pipeline",
                    "Publication scheduling"
                  ]
                }
              ].map((useCase, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur p-8 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-white">{useCase.title}</h3>
                  <div className="space-y-4">
                    <p className="text-slate-300">{useCase.description}</p>
                    <ul className="space-y-2 text-slate-400">
                      {useCase.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center">
                          <span className="text-blue-400 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
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
                Register 
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



