export default function TrackParcel() {
    return (
      <div className="dashboard-content">
        <div className="content-card">
          <div className="card-header">
            <h2>Track Parcel</h2>
          </div>
          <div className="p-6">
            <div className="tracking-container">
              <div className="tracking-input-group">
                <input 
                  type="text" 
                  placeholder="Enter tracking number"
                  className="w-full p-3 border rounded-lg"
                />
                <button className="view-all-btn mt-4">
                  Track Parcel
                </button>
              </div>
              
              <div className="tracking-timeline mt-8">
                <div className="timeline-item complete">
                  <i className="fas fa-check-circle"></i>
                  <div className="timeline-content">
                    <h4>Order Received</h4>
                    <p>Feb 8, 2024 - 09:30 AM</p>
                  </div>
                </div>
                <div className="timeline-item complete">
                  <i className="fas fa-check-circle"></i>
                  <div className="timeline-content">
                    <h4>Processing</h4>
                    <p>Feb 8, 2024 - 02:15 PM</p>
                  </div>
                </div>
                <div className="timeline-item active">
                  <i className="fas fa-truck"></i>
                  <div className="timeline-content">
                    <h4>In Transit</h4>
                    <p>Feb 9, 2024 - 10:45 AM</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <i className="fas fa-box"></i>
                  <div className="timeline-content">
                    <h4>Out for Delivery</h4>
                    <p>Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }