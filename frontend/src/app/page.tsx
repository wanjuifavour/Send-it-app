import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center overflow-hidden">
      <nav className="w-full max-w-7xl flex items-center justify-between px-8 py-4">
        <div className="text-white text-2xl font-bold">SendIt</div>
        <div className="hidden md:flex items-center space-x-8 text-white">
          <a href="#about" className="hover:text-gray-200">About</a>
          <a href="#services" className="hover:text-gray-200">Services</a>
          <a href="#contact" className="hover:text-gray-200">Contact</a>
          <a href="#faqs" className="hover:text-gray-200">FAQs</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/auth/register" className="text-white hover:text-gray-200">Sign Up</a>
          <a href="/auth/login" className="bg-white text-emerald-600 px-6 py-2 rounded-full hover:bg-gray-100 text-sm">Login</a>
        </div>
      </nav>

      <main className="w-full max-w-7xl px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <p className="text-white/80 uppercase tracking-wider">SWIFT DELIVERY SOLUTIONS</p>
          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight">
            Delivering<br />
            Excellence,<br />
            Every Time.
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mt-8">
            <input
              type="text"
              placeholder="Enter your tracking number"
              className="flex-1 px-6 py-3 rounded-full bg-emerald-500/30 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:border-white/40 text-sm"
            />
            <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm">
              Track Package
            </button>
          </div>

          <p className="text-white/80 mt-6 text-sm">
            Trusted by 10,000+ customers nationwide
          </p>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-end">
          <Image
            src="/delivery-van.png"
            alt="Delivery Van"
            width={500}
            height={500}
            priority
            className="w-full max-w-sm h-auto"
          />
        </div>
      </main>
    </div>
  );
}
