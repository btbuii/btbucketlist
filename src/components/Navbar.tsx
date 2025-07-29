import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Utensils, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <div className="logo-icon">
            <MapPin className="map-icon" />
            <Utensils className="utensils-icon" />
          </div>
          <span className="logo-text">btbucketlist</span>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/places" className="nav-link">Places</Link>
          <Link to="/map" className="nav-link">Map</Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>Home</Link>
          <Link to="/places" className="mobile-nav-link" onClick={toggleMenu}>Places</Link>
          <Link to="/map" className="mobile-nav-link" onClick={toggleMenu}>Map</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 