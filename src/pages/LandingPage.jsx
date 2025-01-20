import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import DemoBoard from './DemoBoard';

const LandingPage = () => {
  const [enlargedImage, setEnlargedImage] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)


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

      <header className={`w-full py-4 px-6 fixed top-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <nav className={`flex ${isScrolled ? 'justify-between' : 'justify-end'}  items-center max-w-7xl mx-auto`}>
          <a href="#" onClick={scrollToTop} className={`text-4xl font-bold ${isScrolled ? 'text-black font-thin' : 'hidden'}`}>
            Tremendo
          </a>
          <div className="space-x-4">
            <a href="#about" onClick={scrollToAbout} className={`text-sm font-medium hover:underline ${isScrolled ? 'text-black' : 'text-white'}`}>
              About
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
          <a href="#about" onClick={scrollToAbout} className="bg-white bg-opacity-40 hover:bg-opacity-50 hover:border hover:border-white text-white font-thin py-2 px-4 rounded">
            Learn More
          </a>
        </section>

        <section id="about" className="min-h-screen flex flex-col items-center justify-center p-16 bg-cover bg-center overflow-auto relative" style={{backgroundImage: "url(/mountain.jpg)"}}>
          <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-lg p-8 shadow-lg">
           <div className="space-y-6">
              <p className="text-lg">
                Tremendo brings clarity to task management through beautifully simple design. Our clean, intuitive interface helps you organize work without the clutter, letting you focus on what matters most.
              </p>
              
              <p className="text-lg">
                Whether you're planning personal projects or coordinating with a team, Tremendo adapts to your needs. Create boards that reflect your workflow, organize tasks into lists, and track progress with a quick glance. With smooth drag-and-drop functionality, managing tasks feels natural and effortless.
              </p>

              <h3 className="text-xl font-semibold">Core Features:</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li className="text-lg">
                  <span className="font-medium">Simple Board Creation:</span> Set up dedicated spaces for different projects or areas of focus
                </li>
                <li className="text-lg">
                  <span className="font-medium">Flexible Task Organization:</span> Create, move, and update tasks with intuitive drag-and-drop functionality
                </li>
                <li className="text-lg">
                  <span className="font-medium">Clean Visual Design:</span> Choose between light and dark themes, and personalize your boards with custom backgrounds
                </li>
                <li className="text-lg">
                  <span className="font-medium">Seamless Collaboration:</span> Share boards, assign tasks, and keep everyone aligned with minimal effort
                </li>
              </ul>
            </div>
        
            <div className="block md:hidden space-y-4 md:mx-24 xl:mx-72">
              <img
                className="w-full h-auto rounded shadow-lg"
                src="screenshot3.png"
                alt="Screenshot 3"
                onClick={() => setEnlargedImage("screenshot3.png")}
              />
              <img
                className="w-full h-auto rounded shadow-lg"
                src="screenshot1.png"
                alt="Screenshot 1"
                onClick={() => setEnlargedImage("screenshot1.png")}
              />
              <img
                className="w-full h-auto rounded shadow-lg"
                src="screenshot2.png"
                alt="Screenshot 2"
                onClick={() => setEnlargedImage("screenshot2.png")}
              />
            </div>

            {/* Desktop View: Carousel */}
            <div className="hidden md:block ">
              <Slider {...settings}>
                {['screenshot3.png', 'screenshot1.png', 'screenshot2.png'].map((src, index) => (
                  <div key={index} className="focus:outline-none">
                    <img
                      className="w-full h-auto rounded shadow-lg cursor-pointer"
                      src={src}
                      alt={`Screenshot ${index + 1}`}
                      onClick={() => setEnlargedImage(src)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Register
              </Link>
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Login
              </Link>
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