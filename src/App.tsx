import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Places from './components/Places';
import './components/Navbar.css';
import './components/Places.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <section id="home" className="hero-section">
                <div className="hero-container">
                  <h1 className="hero-title">
                    Your Travel & Dining
                    <span className="gradient-text"> Bucket List</span>
                  </h1>
                  <p className="hero-subtitle">
                    Exploring global destinations with a focus on Thailand and New York
                  </p>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <span className="stat-number">0</span>
                      <span className="stat-label">Places</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">6</span>
                      <span className="stat-label">Regions</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">2</span>
                      <span className="stat-label">Focus Areas</span>
                    </div>
                  </div>
                  <div className="hero-actions">
                    <button className="btn-primary">Start Exploring</button>
                    <button className="btn-secondary">View Map</button>
                  </div>
                </div>
              </section>

              {/* Regions Section */}
              <section className="regions-section">
                <div className="regions-container">
                  <h2 className="regions-title">Global Destinations</h2>
                  <p className="regions-subtitle">Exploring amazing places around the world</p>
                  
                  <div className="regions-grid">
                    <div className="region-card focus">
                      <div className="region-icon">🇹🇭</div>
                      <h3>Thailand</h3>
                      <p>Primary focus area</p>
                    </div>
                    <div className="region-card focus">
                      <div className="region-icon">🗽</div>
                      <h3>New York</h3>
                      <p>Primary focus area</p>
                    </div>
                    <div className="region-card">
                      <div className="region-icon">🌴</div>
                      <h3>SoCal</h3>
                      <p>Coming soon</p>
                    </div>
                    <div className="region-card">
                      <div className="region-icon">🦁</div>
                      <h3>Singapore</h3>
                      <p>Coming soon</p>
                    </div>
                    <div className="region-card">
                      <div className="region-icon">🗾</div>
                      <h3>Japan</h3>
                      <p>Coming soon</p>
                    </div>
                    <div className="region-card">
                      <div className="region-icon">🐉</div>
                      <h3>China</h3>
                      <p>Coming soon</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          } />
          <Route path="/places" element={<Places />} />
          <Route path="/map" element={
            <div className="map-placeholder">
              <h1>Map Coming Soon</h1>
              <p>Interactive map functionality will be implemented here</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
