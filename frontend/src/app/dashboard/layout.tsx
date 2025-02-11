"use client"

import Link from 'next/link';
import './dashboard.css';
import { useStore } from "@/store/useStore"
import { useRouter } from "next/navigation"
import { User } from "@/types/types"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser } = useStore()
  const router = useRouter()

  const handleLogout = () => {
    setUser(null as unknown as User)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/")
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-shipping-fast"></i>
            <span>SendIt</span>
          </div>
          <button id="sidebarToggle" className="toggle-btn" title="Toggle Sidebar">
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>General</h3>
            <Link href="/dashboard" className="active">
              <i className="fas fa-chart-line"></i>
              <span>Overview</span>
            </Link>
            <Link href="/dashboard/parcels">
              <i className="fas fa-box"></i>
              <span>My Parcels</span>
            </Link>
            <Link href="/dashboard/track">
              <i className="fas fa-map-marker-alt"></i>
              <span>Track Parcel</span>
            </Link>
          </div>

          <div className="nav-section admin-section">
            <h3>Admin Controls</h3>
            <Link href="/dashboard/users">
              <i className="fas fa-users"></i>
              <span>Manage Users</span>
            </Link>
            <Link href="/dashboard/all-parcels">
              <i className="fas fa-boxes"></i>
              <span>All Parcels</span>
            </Link>
            <Link href="/dashboard/delivery">
              <i className="fas fa-truck"></i>
              <span>Delivery Status</span>
            </Link>
            <Link href="/dashboard/settings">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </Link>
          </div>
          <div onClick={handleLogout}>
            <Link href="/">
              <i className="fas fa-cog"></i>
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>

      { }
      <main className="main-content">
        <header className="topbar">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>

          <div className="topbar-right">
            <div className="notifications">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </div>
            <div className="user-profile">

              <div className="user-info">
                <span className="user-name">user</span>
                <span className="user-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}