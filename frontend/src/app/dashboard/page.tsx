export default function Dashboard() {
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
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#TRK-123456</td>
                  <td>user</td>
                  <td>Jane Smith</td>
                  <td>
                    <span className="status-badge in-transit">In Transit</span>
                  </td>
                  <td>2024-02-09</td>
                  <td>
                    <button className="action-btn" title="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
