import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <nav className="navbar">
        <div className="logo">
          <h2>SendIt</h2>
        </div>
        <div className="nav-links">
          <Link href="#about">About</Link>
          <Link href="#services">Services</Link>
          <Link href="#contact">Contact</Link>
          <Link href="#faq">FAQs</Link>
        </div>
        <div className="auth-buttons">
          <Link href="/auth/register" className="signup-btn">Sign Up</Link>
          <Link href="/auth/login" className="login-btn">Login</Link>
        </div>
      </nav>
      <main className="hero row-start-2">
        <div className="hero-content">
          <span className="tagline">SWIFT DELIVERY SOLUTIONS</span>
          <h1>Delivering Excellence,<br/>Every Time.</h1>
          <div className="tracking-box">
            <input 
              type="text" 
              placeholder="Enter your tracking number"
              className="tracking-input"
            />
            <button className="track-btn">Track Package</button>
          </div>
          <p className="stats">Trusted by 10,000+ customers nationwide</p>
        </div>
        <div className="hero-image">
          <img src="/delivery car.png" width={450} height={450} alt="Delivery Car" className="delivery-car" />
        </div>
      </main>
    </div>
  );
}
