import React from 'react';

const DeliveryLandingPage = () => {
  return (
    <div className="min-h-screen bg-emerald-600">
      <nav className="w-full px-4 py-4 flex flex-wrap justify-between items-center">
        <div className="text-white text-2xl font-bold">SendIt</div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#about" className="text-white hover:text-gray-200">About</a>
          <a href="#services" className="text-white hover:text-gray-200">Services</a>
          <a href="#contact" className="text-white hover:text-gray-200">Contact</a>
          <a href="#faqs" className="text-white hover:text-gray-200">FAQs</a>
        </div>

        <div className="flex items-center space-x-4">
          <a href="/auth/register"><button className="text-white hover:text-gray-200">Sign Up</button></a>
          <a href="/auth/login">
          <button className="bg-white text-emerald-600 px-6 py-2 rounded-full hover:bg-gray-100">
            Login
          </button>          
          </a>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        <div className="text-white max-w-2xl">
          <p className="text-sm uppercase tracking-wider mb-4">Swift Delivery Solutions</p>
          <h1 className="text-5xl font-bold leading-tight mb-8">
            Delivering<br />
            Excellence,<br />
            Every Time.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mb-6">
            <input
              type="text"
              placeholder="Enter your tracking number"
              className="flex-1 px-6 py-3 rounded-full bg-emerald-500/30 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:border-white/40"
            />
            <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              Track Package
            </button>
          </div>

          <p className="text-sm text-white/80">
            Trusted by 10,000+ customers nationwide
          </p>
        </div>

        <div className="mt-12 lg:mt-0 w-full max-w-md">
          <div className="relative w-full aspect-square">
            <img
              src="/delivery-van.png"
              alt="Delivery Van"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeliveryLandingPage;
