import Link from 'next/link';
import '../../auth.css';

export default function Login() {
  return (
    <div className="container">
      <div className="auth-box">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#ff5722"/>
            <path d="M12 20h16M20 12v16" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        <form>
          <div className="input-group">
            <input type="email" id="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input type="password" id="password" placeholder="Password" required />
          </div>
          <div className="forgot-password">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <div className="switch-auth">
          <p>Don't have an account? <Link href="/auth/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}