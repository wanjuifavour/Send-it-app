export default function DeliveryStatus() {
    return (
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-truck"></i>
            </div>
            <div className="stat-details">
              <h3>Total Deliveries</h3>
              <p className="stat-number">856</p>
              <span className="stat-trend positive">Today</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-details">
              <h3>Average Time</h3>
              <p className="stat-number">2.5h</p>
              <span className="stat-trend">Per Delivery</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-details">
              <h3>On-Time Rate</h3>
              <p className="stat-number">95%</p>
              <span className="stat-trend positive">+2.3%</span>
            </div>
          </div>
        </div>
  
        <div className="content-card mt-6">
          <div className="card-header">
            <h2>Active Deliveries</h2>
            <button className="view-all-btn">Refresh</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Current Location</th>
                  <th>Deliveries Left</th>
                  <th>Status</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    driver: 'John Smith',
                    vehicle: 'Van-001',
                    location: 'Downtown',
                    deliveries: 5,
                    status: 'On Route',
                    eta: '30 min'
                  },
                  {
                    driver: 'Sarah Wilson',
                    vehicle: 'Van-002',
                    location: 'Suburbs',
                    deliveries: 3,
                    status: 'On Route',
                    eta: '45 min'
                  },
                  {
                    driver: 'Mike Johnson',
                    vehicle: 'Van-003',
                    location: 'Airport Area',
                    deliveries: 7,
                    status: 'Loading',
                    eta: '15 min'
                  }
                ].map((delivery, index) => (
                  <tr key={index}>
                    <td>{delivery.driver}</td>
                    <td>{delivery.vehicle}</td>
                    <td>{delivery.location}</td>
                    <td>{delivery.deliveries}</td>
                    <td>
                      <span className={`status-badge ${delivery.status.toLowerCase().replace(' ', '-')}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td>{delivery.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }