"use client";
import { useEffect, useState } from "react";
import { getParcels } from "@/services/api";
import { useStore } from "@/store/useStore";
import { Parcel } from "@/types/types";

export default function Dashboard() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await getParcels();
        setParcels(data);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchParcels();
    }
  }, [user]);

  if (loading) {
    return <div>Loading parcels...</div>;
  }

  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-box"></i>
          </div>
          <div className="stat-details">
            <h3>Total Parcels</h3>
            <p className="stat-number">1,254</p>
            <span className="stat-trend positive">+15.3%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-truck"></i>
          </div>
          <div className="stat-details">
            <h3>In Transit</h3>
            <p className="stat-number">423</p>
            <span className="stat-trend">Active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>Delivered</h3>
            <p className="stat-number">826</p>
            <span className="stat-trend positive">+12.8%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-number">3,856</p>
            <span className="stat-trend positive">+8.2%</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>Recent Parcels</h2>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Pickup Location</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Weight (kg)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel.id}>
                  <td>#{parcel.id.slice(0, 8)}</td>
                  <td>{parcel.pickupLocation}</td>
                  <td>{parcel.destination}</td>
                  <td>
                    <span className={`status-badge ${parcel.status.toLowerCase().replace(' ', '-')}`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td>{parcel.weight}</td>
                  <td>
                    <button className="action-btn" title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
