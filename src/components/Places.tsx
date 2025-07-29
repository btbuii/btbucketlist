import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Search, X, MapPin, Tag, FileText, ChevronLeft, ChevronRight, Globe, Banknote, FileCheck, Zap, CloudRain, Calendar, Smartphone, ExternalLink } from 'lucide-react';
import placesData from '../data/places.json';
import travelInfoData from '../data/travel-info.json';

interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  notes: string;
  tags?: string[];
  type: 'restaurant' | 'destination';
  imageUrl: string;
  ratings: {
    taste?: number;
    experience: number;
    value: number;
    enjoyment?: number;
  };
  commentary: string;
  gallery?: string[];
  favorites?: {
    brian?: boolean;
    orn?: boolean;
  };
}

interface PlacesData {
  thailand: Place[];
  newyork: Place[];
}

interface TravelInfoData {
  thailand: {
    hero: {
      title: string;
      description: string;
      images: string[];
      highlights: Array<{
        shortText: string;
        backgroundImage: string;
      }>;
    };
    overview: string;
    destinationDetails: {
      language: string;
      currency: string;
      visa: string;
      powerPlugs: string;
      climate: string;
      bestTime: string;
    };
    recommendedApps: Array<{
      name: string;
      description: string;
      logo: string;
    }>;
    flightInfo: {
      mainAirports: Array<{
        code: string;
        name: string;
        description: string;
      }>;
      flightTime: string;
      bestAirlines: string;
      estimatedPrices: string;
    };
    bestPlacesToStay: {
      bangkok: Array<{
        area: string;
        description: string;
      }>;
      islands: Array<{
        area: string;
        description: string;
      }>;
    };
    idealItineraries: Array<{
      title: string;
      description: string;
      days: Array<{
        period: string;
        description: string;
      }>;
    }>;
  };
  newyork: {
    hero: {
      title: string;
      description: string;
      images: string[];
      highlights: Array<{
        shortText: string;
        backgroundImage: string;
      }>;
    };
    overview: string;
    destinationDetails: {
      language: string;
      currency: string;
      visa: string;
      powerPlugs: string;
      climate: string;
      bestTime: string;
    };
    recommendedApps: Array<{
      name: string;
      description: string;
      logo: string;
    }>;
    flightInfo: {
      mainAirports: Array<{
        code: string;
        name: string;
        description: string;
      }>;
      flightTime: string;
      bestAirlines: string;
      estimatedPrices: string;
    };
    bestPlacesToStay: {
      manhattan: Array<{
        area: string;
        description: string;
      }>;
      otherBoroughs: Array<{
        area: string;
        description: string;
      }>;
    };
    idealItineraries: Array<{
      title: string;
      description: string;
      days: Array<{
        period: string;
        description: string;
      }>;
    }>;
  };
}

type Region = 'thailand' | 'newyork' | 'california' | 'singapore' | 'japan' | 'china';

// Get hero data from travel info
const getHeroData = (region: Region) => {
  return (travelInfoData as TravelInfoData)[region as keyof TravelInfoData]?.hero;
};

const Places = () => {
  const [places, setPlaces] = useState<PlacesData>(placesData as PlacesData);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('thailand');
  const [placeTypeFilter, setPlaceTypeFilter] = useState<'all' | 'restaurants' | 'attractions'>('all');
  const [thailandLocationFilter, setThailandLocationFilter] = useState<'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan'>('everywhere');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'none'>('none');
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    category: '',
    notes: '',
    type: 'restaurant' as 'restaurant' | 'destination',
    imageUrl: ''
  });

  // Carousel state
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const autoSlideIntervalRef = useRef<number | null>(null);

  const regionOrder: Region[] = ['thailand', 'newyork', 'california', 'singapore', 'japan', 'china'];

  // Update carousel index when region changes
  useEffect(() => {
    const heroData = getHeroData(selectedRegion);
    if (heroData) {
      setHeroImageIndex(0); // Reset hero image index when region changes
    }
  }, [selectedRegion]);

  // Auto-slide functionality for hero images
  useEffect(() => {
    const currentHeroData = getHeroData(selectedRegion);
    if (!currentHeroData || currentHeroData.images.length <= 1) return;

    // Clear existing interval
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }

    // Set new interval for auto-sliding (5 seconds)
    autoSlideIntervalRef.current = window.setInterval(() => {
      setHeroImageIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % currentHeroData.images.length;
        return nextIndex;
      });
    }, 5000);

    // Cleanup on unmount or when selectedRegion changes
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, [selectedRegion]);

  // Reset hero image index when region changes
  useEffect(() => {
    setHeroImageIndex(0);
  }, [selectedRegion]);

  // Set initial background and update when region changes
  useEffect(() => {
    document.body.classList.remove('thailand-bg', 'newyork-bg');
    if (selectedRegion === 'thailand') {
      document.body.classList.add('thailand-bg');
    } else if (selectedRegion === 'newyork') {
      document.body.classList.add('newyork-bg');
    }
  }, [selectedRegion]);

  // Scroll tabs when active tab changes
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('.tab-button.active') as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedRegion]);

  const handleRegionChange = (newRegion: Region) => {
    const currentIndex = regionOrder.indexOf(selectedRegion);
    const newIndex = regionOrder.indexOf(newRegion);
    
    if (newIndex > currentIndex) {
      setSlideDirection('left');
    } else if (newIndex < currentIndex) {
      setSlideDirection('right');
    } else {
      setSlideDirection('none');
    }

    setSelectedRegion(newRegion);
    
    // Update body background class
    document.body.classList.remove('thailand-bg', 'newyork-bg');
    if (newRegion === 'thailand') {
      document.body.classList.add('thailand-bg');
    } else if (newRegion === 'newyork') {
      document.body.classList.add('newyork-bg');
    }
  };

  const handleHeroImageNavigation = (direction: 'next' | 'prev') => {
    const currentHeroData = getHeroData(selectedRegion);
    if (!currentHeroData) return;

    setHeroImageIndex(prevIndex => {
      if (direction === 'next') {
        return (prevIndex + 1) % currentHeroData.images.length;
      } else {
        return prevIndex === 0 ? currentHeroData.images.length - 1 : prevIndex - 1;
      }
    });

    // Reset auto-slide timer when user manually navigates
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    
    autoSlideIntervalRef.current = window.setInterval(() => {
      setHeroImageIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % currentHeroData.images.length;
        return nextIndex;
      });
    }, 5000);
  };

  // Define categories for each region
  const thailandCategories = [
    'Best Thai Restaurants',
    'Other Cuisines',
    'Markets',
    'Desserts',
    'Cultural',
    'Shopping',
    'Cafes',
    'Views',
    'Drinks',
    'Unique Experiences',
    'Nature',
    'Hotels'
  ];

  const newYorkCategories = [
    'Best Restaurants',
    'Asian Cuisines',
    'Desserts', 
    'Drinks',
    'Cultural',
    'Nature',
    'Views',
    'Shopping',
    'Unique Experiences',
    'Hotels'
  ];

  const californiaCategories = [
    'Best California Restaurants',
    'Other Cuisines',
    'Desserts',
    'Drinks',
    'Cultural',
    'Nature',
    'Views',
    'Shopping',
    'Trending',
    'Unique Experiences'
  ];

  const singaporeCategories = [
    'Best Singapore Restaurants',
    'Other Cuisines',
    'Desserts',
    'Drinks',
    'Cultural',
    'Nature',
    'Views',
    'Shopping',
    'Trending',
    'Unique Experiences'
  ];

  const japanCategories = [
    'Best Japanese Restaurants',
    'Other Cuisines',
    'Desserts',
    'Drinks',
    'Cultural',
    'Nature',
    'Views',
    'Shopping',
    'Trending',
    'Unique Experiences'
  ];

  const chinaCategories = [
    'Best Chinese Restaurants',
    'Other Cuisines',
    'Desserts',
    'Drinks',
    'Cultural',
    'Nature',
    'Views',
    'Shopping',
    'Trending',
    'Unique Experiences'
  ];

  // Get current places based on selected region
  const currentPlaces = useMemo(() => {
    switch (selectedRegion) {
      case 'thailand':
        return places.thailand;
      case 'newyork':
        return places.newyork;
      default:
        return [];
    }
  }, [places, selectedRegion]);

  // Filter places based on search term and region
  const filteredPlaces = useMemo(() => {
    return currentPlaces.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          place.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (place.tags && place.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      // Place type filtering
      let matchesPlaceType = true;
      if (placeTypeFilter === 'restaurants') {
        matchesPlaceType = place.type === 'restaurant';
      } else if (placeTypeFilter === 'attractions') {
        matchesPlaceType = place.type === 'destination';
      }

      // Thailand location filtering
      let matchesThailandLocation = true;
      if (selectedRegion === 'thailand' && thailandLocationFilter !== 'everywhere') {
        const address = place.address.toLowerCase();
        switch (thailandLocationFilter) {
          case 'bangkok':
            matchesThailandLocation = address.includes('bangkok') || address.includes('silom') || address.includes('siam') || address.includes('sathorn');
            break;
          case 'phuket':
            matchesThailandLocation = address.includes('phuket');
            break;
          case 'pattaya':
            matchesThailandLocation = address.includes('pattaya');
            break;
          case 'chiang-mai':
            matchesThailandLocation = address.includes('chiang mai') || address.includes('chiangmai');
            break;
          case 'isaan':
            matchesThailandLocation = address.includes('isaan') || address.includes('isan') || address.includes('udon') || address.includes('khon kaen');
            break;
        }
      }
      
      return matchesSearch && matchesPlaceType && matchesThailandLocation;
    });
  }, [currentPlaces, searchTerm, selectedRegion, placeTypeFilter, thailandLocationFilter]);

  // Group places by category
  const placesByCategory = useMemo(() => {
    let categories: string[] = [];
    
    switch (selectedRegion) {
      case 'thailand':
        categories = thailandCategories;
        break;
      case 'newyork':
        categories = newYorkCategories;
        break;
      case 'california':
        categories = californiaCategories;
        break;
      case 'singapore':
        categories = singaporeCategories;
        break;
      case 'japan':
        categories = japanCategories;
        break;
      case 'china':
        categories = chinaCategories;
        break;
    }
    
    const grouped: { [key: string]: Place[] } = {};
    
    categories.forEach(category => {
      grouped[category] = filteredPlaces.filter(place => place.category === category);
    });
    
    return grouped;
  }, [filteredPlaces, selectedRegion, thailandCategories, newYorkCategories, californiaCategories, singaporeCategories, japanCategories, chinaCategories]);

  const addPlace = () => {
    if (newPlace.name && newPlace.address) {
      const place: Place = {
        id: Date.now().toString(),
        ...newPlace,
        ratings: {
          taste: 4.0,
          experience: 4.0,
          value: 4.0
        },
        commentary: "This place offers a unique blend of authentic flavors and modern atmosphere. The service is consistently excellent, and the ambiance perfectly captures the local culture. Whether you're visiting for the first time or returning as a regular, you'll find something new to appreciate with each visit."
      };
      
      setPlaces(prevPlaces => ({
        ...prevPlaces,
        [selectedRegion]: [...prevPlaces[selectedRegion as keyof PlacesData], place]
      }));
      
      setNewPlace({ name: '', address: '', category: '', notes: '', type: 'restaurant', imageUrl: '' });
      setShowAddForm(false);
    }
  };

  const removePlace = (id: string) => {
    setPlaces(prevPlaces => ({
      ...prevPlaces,
      [selectedRegion]: prevPlaces[selectedRegion as keyof PlacesData].filter(place => place.id !== id)
    }));
  };

  const toggleFavorite = (id: string, person: 'brian' | 'orn') => {
    setPlaces(prevPlaces => ({
      ...prevPlaces,
      [selectedRegion]: prevPlaces[selectedRegion as keyof PlacesData].map(place => {
        if (place.id === id) {
          return {
            ...place,
            favorites: {
              ...place.favorites,
              [person]: !place.favorites?.[person]
            }
          };
        }
        return place;
      })
    }));
  };

  const openModal = (place: Place) => {
    setSelectedPlace(place);
    setGalleryIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlace(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      let starClass = 'modal-star';
      
      if (rating >= starValue) {
        starClass += '';
      } else if (rating >= starValue - 0.5) {
        starClass += ' half';
      } else {
        starClass += ' empty';
      }
      
      return (
        <span key={i} className={starClass}>
          ★
        </span>
      );
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPlaceTypeFilter('all');
    setThailandLocationFilter('everywhere');
  };

  const hasFilters = searchTerm || placeTypeFilter !== 'all' || thailandLocationFilter !== 'everywhere';

  // Function to get category description
  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      'Best Thai Restaurants': 'Authentic Thai cuisine featuring traditional flavors, some with a modern twist.',
      'Cafes': 'Cozy shops and cafes offering coffee, tea, and comfortable spaces for work/study.',
      'Other Cuisines': 'Global flavors, from Asian fusion to American favorites.',
      'Desserts': 'Cakes, ice cream, and sweets to satisfy any craving.',
      'Drinks': 'Bars, rooftop lounges, and beverage spots offering cocktails and refreshing drinks in stylish settings.',
      'Unique Experiences': 'Unforgettable activities and places you won’t find elsewhere.',
      'Cultural': 'Temples, museums, and cultural landmarks that reflect Thailand’s heritage.',
      'Nature': 'Parks and outdoor spots for relaxing or exploring.',
      'Hotels': 'From luxury stays to boutique hideaways with exceptional amenities.',
      'Views': 'Locations with spectacular vistas and panoramic views, perfect for photography and enjoying breathtaking scenery.',
      'Markets': 'Markets full of street food, local goods, and lively vibes.',
      'Shopping': 'Malls with food courts, activities, and everything from high-end to handmade.',
      'Best Restaurants': 'Top-tier dining establishments known for exceptional cuisine, service, and memorable dining experiences.',
      'Asian Cuisines': 'Restaurants specializing in various Asian cuisines including Chinese, Japanese, Korean, and other regional specialties.',
      'Best California Restaurants': 'Premier dining spots showcasing California\'s diverse culinary scene and farm-to-table philosophy.',
      'Best Singapore Restaurants': 'Exceptional restaurants featuring Singapore\'s multicultural cuisine and innovative dining concepts.',
      'Best Japanese Restaurants': 'Authentic Japanese dining experiences featuring sushi, ramen, and traditional Japanese cuisine.',
      'Best Chinese Restaurants': 'Traditional and modern Chinese restaurants offering authentic flavors and regional specialties.',
      'Trending': 'Popular and up-and-coming destinations that are currently making waves in the local scene.'
    };
    return descriptions[category] || 'Explore amazing places in this category.';
  };

  return (
    <div className="places-page">
      {/* Tab Navigation */}
      <div className="tab-navigation" ref={tabsRef}>
        <button
          className={`tab-button ${selectedRegion === 'thailand' ? 'active' : ''}`}
          onClick={() => handleRegionChange('thailand')}
          data-full-text="THAILAND"
        >
          THAILAND
        </button>
        <button
          className={`tab-button ${selectedRegion === 'newyork' ? 'active' : ''}`}
          onClick={() => handleRegionChange('newyork')}
          data-full-text="NEW YORK"
        >
          NEW YORK
        </button>
        <button
          className={`tab-button disabled`}
          disabled
          data-full-text="CALIFORNIA"
        >
          CALIFORNIA
        </button>
        <button
          className={`tab-button disabled`}
          disabled
          data-full-text="SINGAPORE"
        >
          SINGAPORE
        </button>
        <button
          className={`tab-button disabled`}
          disabled
          data-full-text="JAPAN"
        >
          JAPAN
        </button>
        <button
          className={`tab-button disabled`}
          disabled
          data-full-text="CHINA"
        >
          CHINA
        </button>
      </div>

      {/* Dynamic Hero Banner */}
      <div className="hero-carousel-container">
        <div className="hero-carousel" ref={carouselRef}>
          {(() => {
            const heroData = getHeroData(selectedRegion);
            if (!heroData) return null;
            
            return (
              <div 
                className="hero-carousel-item active"
                style={{ 
                  backgroundImage: `url(${heroData.images[heroImageIndex]})`
                }}
              >
                {/* Hero Image Navigation Overlays */}
                {heroData.images.length > 1 && (
                  <>
                    <div
                      className="hero-navigation-overlay-left"
                      onClick={() => handleHeroImageNavigation('prev')}
                    />
                    <div
                      className="hero-navigation-overlay-right"
                      onClick={() => handleHeroImageNavigation('next')}
                    />
                  </>
                )}
                
                {/* Hero Image Progress Bar */}
                {heroData.images.length > 1 && (
                  <div className="hero-progress-container">
                    {heroData.images.map((_, imageIndex) => (
                      <div key={imageIndex} className="hero-progress-bar">
                        <div 
                          className={`hero-progress-fill ${imageIndex === heroImageIndex ? 'active' : ''}`}
                          style={{
                            width: imageIndex === heroImageIndex ? '100%' : 
                                   imageIndex < heroImageIndex ? '100%' : '0%'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="hero-overlay">
                  <div className="hero-content-wrapper active">
                    <div className="hero-content">
                      <h1>{heroData.title}</h1>
                      <p>{heroData.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
        
        {/* Carousel Navigation Dots */}
        <div className="carousel-dots">
          {(() => {
            const heroData = getHeroData(selectedRegion);
            return heroData?.images.map((_, imageIndex) => (
              <button
                key={imageIndex}
                className={`carousel-dot ${imageIndex === heroImageIndex ? 'active' : ''}`}
                onClick={() => setHeroImageIndex(imageIndex)}
              />
            ));
          })()}
        </div>
      </div>

      {/* Destination Highlights Section */}
      <div className="destination-highlights">
        <div className="destination-info">
          <h2>
            {selectedRegion === 'thailand' ? "The Land of Smiles" : "The Big Apple"}
          </h2>
          <p>
            {selectedRegion === 'thailand' ? 
              "From sizzling street food in Bangkok to golden temples and lively night markets, Thailand is a vibrant mix of rich history, bold flavors, and affordable luxury. Beyond the cities, you'll find lush jungles, crystal-clear beaches, and warm hospitality that leave a lasting impression long after you've left." :
              "The iconic Manhattan skyline, with landmarks like the Empire State Building and One World Trade Center, is just the beginning. From street food and classic delis to Michelin-starred restaurants, the food scene reflects flavors from all over the world. Green spaces like Central Park and the High Line offer a break from the rush, while SoHo and Fifth Avenue serve up some of the best shopping anywhere."
            }
          </p>
        </div>
        <div className="highlights-list">
          {(() => {
            const heroData = getHeroData(selectedRegion);
            return heroData?.highlights.map((highlight, highlightIndex) => (
              <div 
                key={highlightIndex} 
                className="highlight-item"
                style={{ backgroundImage: `url(${highlight.backgroundImage})` }}
              >
                <span className="highlight-text">{highlight.shortText}</span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Travel Information Section */}
      <div className="travel-details-container">
        {/* Overview Section */}
        <div className="travel-overview-section">
          <h2>Travel Overview</h2>
          <p>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.overview}</p>
        </div>
        {/* Destination Details and Recommended Apps */}
        <div className="travel-details-section side-by-side">
          <div className="travel-info-post">
            <h3>Destination Details</h3>
            <div className="details-grid-two-columns">
              <div className="detail-item">
                <div className="detail-icon">
                  <Globe size={20} />
                </div>
                <div className="detail-content">
                  <strong>Language:</strong>
                  <span>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.destinationDetails.language}</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <Banknote size={20} />
                </div>
                <div className="detail-content">
                  <strong>Currency:</strong>
                  <span>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.destinationDetails.currency}</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <FileCheck size={20} />
                </div>
                <div className="detail-content">
                  <strong>Visa:</strong>
                  <span>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.destinationDetails.visa}</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <Zap size={20} />
                </div>
                <div className="detail-content">
                  <strong>Power Plugs:</strong>
                  <span>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.destinationDetails.powerPlugs}</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <CloudRain size={20} />
                </div>
                <div className="detail-content">
                  <strong>Climate:</strong>
                  <span>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.destinationDetails.climate}</span>
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={20} />
                </div>
                <div className="detail-content">
                  <strong>Best Time:</strong>
                  <span>{(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.destinationDetails.bestTime}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="travel-info-post">
            <h3>Recommended Apps</h3>
            <div className="app-list-two-columns">
              {(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.recommendedApps.map((app, index) => (
                <div key={index} className="app-item">
                  <div className="app-icon">
                    <Smartphone size={24} />
                  </div>
                  <div className="app-info">
                    <div className="app-name">
                      <strong>{app.name}</strong>
                      <ExternalLink size={16} className="external-link-icon" />
                    </div>
                    <span>{app.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flight Info and Itineraries */}
        <div className="travel-details-section side-by-side">
          <div className="travel-info-post">
            <h3>Flight Information</h3>
            <div className="flight-info">
              <p><strong>Main Airports:</strong></p>
              <ul>
                {(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.flightInfo.mainAirports.map((airport, index) => (
                  <li key={index}>
                    <strong>{airport.code}</strong> - {airport.name}
                    {airport.description && ` - ${airport.description}`}
                  </li>
                ))}
              </ul>
              <p><strong>Flight Time:</strong> {(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.flightInfo.flightTime}</p>
              <p><strong>Best Airlines:</strong> {(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.flightInfo.bestAirlines}</p>
              <p><strong>Estimated Prices:</strong> {(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.flightInfo.estimatedPrices}</p>
            </div>
          </div>
          <div className="travel-info-post">
            <h3>Ideal Itineraries</h3>
            <div className="itinerary-suggestions">
              {(travelInfoData as TravelInfoData)[selectedRegion as keyof TravelInfoData]?.idealItineraries.map((itinerary, index) => (
                <div key={index} className="itinerary">
                  <h4>{itinerary.title}</h4>
                  <p className="itinerary-description">{itinerary.description}</p>
                  <ul>
                    {itinerary.days.map((day, dayIndex) => (
                      <li key={dayIndex}>
                        <strong>{day.period}:</strong> {day.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="places-content-container">
        {/* Personal Bucket List Header - Only show for Thailand */}
        {selectedRegion === 'thailand' && (
          <div className="bucket-list-header">
            <div className="profile-section">
              <div className="profile-images">
                <div className="profile-image">
                  <img 
                    src="/src/data/images/brian.jpg" 
                    alt="Brian"
                  />
                </div>
                <div className="profile-image">
                  <img 
                    src="/src/data/images/orn.jpg" 
                    alt="Orn"
                  />
                </div>
              </div>
              <div className="profile-info">
                <h2>Brian & Orn's Travel List</h2>
                <p>Below is a collection of places we've visited in the past and restaurants/destinations we're planning to explore together in the future.</p>
              </div>
            </div>
            
            {/* Favorite Legend */}
            <div className="favorite-legend">
              <div className="legend-item">
                <div className="legend-icon brian-legend">
                  <img 
                    src="/src/data/images/brian.jpg" 
                    alt="Brian"
                  />
                </div>
                <span>Brian's recommended places</span>
              </div>
              <div className="legend-item">
                <div className="legend-icon orn-legend">
                  <img 
                    src="/src/data/images/orn.jpg" 
                    alt="Orn"
                  />
                </div>
                <span>Orn's recommended places</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Search Bar and Filters */}
        <div className="search-filters">
          <div className="search-section">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, address, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filter Groups Container */}
            <div className="filter-groups-container">
              {/* Place Type Radio Buttons */}
              <div className="filter-group">
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="placeType"
                      value="all"
                      checked={placeTypeFilter === 'all'}
                      onChange={(e) => setPlaceTypeFilter(e.target.value as 'all' | 'restaurants' | 'attractions')}
                    />
                    All places
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="placeType"
                      value="restaurants"
                      checked={placeTypeFilter === 'restaurants'}
                      onChange={(e) => setPlaceTypeFilter(e.target.value as 'all' | 'restaurants' | 'attractions')}
                    />
                    Restaurants only
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="placeType"
                      value="attractions"
                      checked={placeTypeFilter === 'attractions'}
                      onChange={(e) => setPlaceTypeFilter(e.target.value as 'all' | 'restaurants' | 'attractions')}
                    />
                    Attractions only
                  </label>
                </div>
              </div>

              {/* Thailand Location Radio Buttons */}
              {selectedRegion === 'thailand' && (
                <div className="filter-group">
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="thailandLocation"
                        value="everywhere"
                        checked={thailandLocationFilter === 'everywhere'}
                        onChange={(e) => setThailandLocationFilter(e.target.value as 'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan')}
                      />
                      Everywhere
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="thailandLocation"
                        value="bangkok"
                        checked={thailandLocationFilter === 'bangkok'}
                        onChange={(e) => setThailandLocationFilter(e.target.value as 'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan')}
                      />
                      Bangkok
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="thailandLocation"
                        value="phuket"
                        checked={thailandLocationFilter === 'phuket'}
                        onChange={(e) => setThailandLocationFilter(e.target.value as 'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan')}
                      />
                      Phuket
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="thailandLocation"
                        value="pattaya"
                        checked={thailandLocationFilter === 'pattaya'}
                        onChange={(e) => setThailandLocationFilter(e.target.value as 'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan')}
                      />
                      Pattaya
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="thailandLocation"
                        value="chiang-mai"
                        checked={thailandLocationFilter === 'chiang-mai'}
                        onChange={(e) => setThailandLocationFilter(e.target.value as 'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan')}
                      />
                      Chiang Mai
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="thailandLocation"
                        value="isaan"
                        checked={thailandLocationFilter === 'isaan'}
                        onChange={(e) => setThailandLocationFilter(e.target.value as 'everywhere' | 'bangkok' | 'phuket' | 'pattaya' | 'chiang-mai' | 'isaan')}
                      />
                      Isaan
                    </label>
                  </div>
                </div>
              )}

              {/* Clear Filters Button */}
              {hasFilters && (
                <button onClick={clearSearch} className="clear-filters-btn visible">
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="add-place-btn"
          >
            <Plus size={20} />
            Add Place
          </button>
        </div>

      {/* Add Place Form */}
      {showAddForm && (
        <div className="add-form-overlay">
          <div className="add-form">
            <div className="form-header">
              <h3>Add New Place</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={newPlace.name}
                onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
                placeholder="Place name"
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                value={newPlace.address}
                onChange={(e) => setNewPlace({...newPlace, address: e.target.value})}
                placeholder="Full address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newPlace.type}
                  onChange={(e) => setNewPlace({...newPlace, type: e.target.value as 'restaurant' | 'destination'})}
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="destination">Destination</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newPlace.category}
                  onChange={(e) => setNewPlace({...newPlace, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {(() => {
                    switch (selectedRegion) {
                      case 'thailand': return thailandCategories;
                      case 'newyork': return newYorkCategories;
                      case 'california': return californiaCategories;
                      case 'singapore': return singaporeCategories;
                      case 'japan': return japanCategories;
                      case 'china': return chinaCategories;
                      default: return [];
                    }
                  })().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={newPlace.notes}
                onChange={(e) => setNewPlace({...newPlace, notes: e.target.value})}
                placeholder="Additional notes or description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={newPlace.imageUrl}
                onChange={(e) => setNewPlace({...newPlace, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-actions">
              <button onClick={() => setShowAddForm(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={addPlace} className="save-btn">
                Save Place
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Places by Category */}
        {Object.entries(placesByCategory).map(([category, categoryPlaces]) => (
          categoryPlaces.length > 0 && (
            <div key={category} className="category-section">
              <div className="category-header">
                <h2>{category}</h2>
                <div className="category-divider"></div>
              </div>
              <div className="category-description">
                <p>{getCategoryDescription(category)}</p>
              </div>
              <div className="places-grid">
                {categoryPlaces.map(place => (
                  <div key={place.id} className="place-card" onClick={() => openModal(place)}>
                    <div className="card-image" style={{ backgroundImage: `url(${place.imageUrl})` }}>
                      
                      {/* Favorite Indicators */}
                      <div className="favorite-indicators">
                        {place.favorites?.brian && (
                          <div className="favorite-indicator brian-favorite" title="Brian's Favorite">
                            <img 
                              src="/src/data/images/brian.jpg" 
                              alt="Brian"
                            />
                          </div>
                        )}
                        {place.favorites?.orn && (
                          <div className="favorite-indicator orn-favorite" title="Orn's Favorite">
                            <img 
                              src="/src/data/images/orn.jpg" 
                              alt="Orn"
                            />
                          </div>
                        )}
                      </div>

                      <h3 className="place-name">{place.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* No Results */}
        {filteredPlaces.length === 0 && (
          <div className="no-results">
            <p>No places found matching your criteria</p>
            <button onClick={clearSearch} className="clear-filters-btn">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Place Detail Modal */}
      {showModal && selectedPlace && (
        <div className="place-modal-overlay" onClick={closeModal}>
          <div className="place-modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="modal-close-btn">
              <X size={24} />
            </button>
            {/* Modal Gallery */}
            <div className="modal-image" style={{ backgroundImage: `url(${selectedPlace.gallery ? selectedPlace.gallery[galleryIndex] : selectedPlace.imageUrl})` }}>
              {/* Slide number indicator */}
              {selectedPlace.gallery && selectedPlace.gallery.length > 1 && (
                <div className="modal-gallery-slide-indicator">
                  {galleryIndex + 1}/{selectedPlace.gallery.length}
                </div>
              )}
              {/* Gallery navigation */}
              {selectedPlace.gallery && selectedPlace.gallery.length > 1 && (
                <>
                  {galleryIndex > 0 && (
                    <button
                      className="modal-gallery-left"
                      onClick={e => { e.stopPropagation(); setGalleryIndex(i => Math.max(0, i - 1)); }}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="modal-gallery-chevron" />
                    </button>
                  )}
                  {galleryIndex < (selectedPlace.gallery.length - 1) && (
                    <button
                      className="modal-gallery-right"
                      onClick={e => { e.stopPropagation(); setGalleryIndex(i => Math.min(selectedPlace.gallery!.length - 1, i + 1)); }}
                      aria-label="Next image"
                    >
                      <ChevronRight className="modal-gallery-chevron" />
                    </button>
                  )}
                  {/* Overlay click areas for story-like navigation */}
                  <div
                    className="modal-gallery-overlay-left"
                    style={{ left: 0, top: 0, bottom: 0, width: '50%', position: 'absolute', zIndex: 5, cursor: galleryIndex > 0 ? 'pointer' : 'default' }}
                    onClick={e => { e.stopPropagation(); if (galleryIndex > 0) setGalleryIndex(i => i - 1); }}
                  />
                  <div
                    className="modal-gallery-overlay-right"
                    style={{ right: 0, top: 0, bottom: 0, width: '50%', position: 'absolute', zIndex: 5, cursor: galleryIndex < (selectedPlace.gallery.length - 1) ? 'pointer' : 'default' }}
                    onClick={e => { e.stopPropagation(); if (galleryIndex < selectedPlace.gallery!.length - 1) setGalleryIndex(i => i + 1); }}
                  />
                </>
              )}
              <h2 className="modal-title">{selectedPlace.name}</h2>
            </div>
            <div className="modal-content">
              <div className="modal-details">
                {selectedPlace.notes && (
                  <div className="modal-detail-item">
                    <FileText size={20} />
                    <span className="modal-notes">{selectedPlace.notes}</span>
                  </div>
                )}
                <div className="modal-detail-item">
                  <MapPin size={20} />
                  <span>{selectedPlace.address}</span>
                </div>
                <div className="modal-detail-item">
                  <Tag size={20} />
                  <div className="modal-tags">
                    {selectedPlace.tags && selectedPlace.tags.length > 0 && selectedPlace.tags.map((tag, index) => (
                      <span key={index} className="modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-ratings-section">
                <div className="modal-ratings-grid">
                  {selectedPlace.type === 'restaurant' ? (
                    <>
                      <div className="modal-rating-item">
                        <div className="modal-rating-label">Taste</div>
                        <div className="modal-rating-stars">
                          {renderStars(selectedPlace.ratings.taste ?? 0.0)}
                          <span className="modal-rating-number">{selectedPlace.ratings.taste?.toFixed(1) ?? '0.0'}</span>
                        </div>
                      </div>
                      <div className="modal-rating-item">
                        <div className="modal-rating-label">Experience</div>
                        <div className="modal-rating-stars">
                          {renderStars(selectedPlace.ratings.experience)}
                          <span className="modal-rating-number">{selectedPlace.ratings.experience.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="modal-rating-item">
                        <div className="modal-rating-label">Value</div>
                        <div className="modal-rating-stars">
                          {renderStars(selectedPlace.ratings.value)}
                          <span className="modal-rating-number">{selectedPlace.ratings.value.toFixed(1)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-rating-item">
                        <div className="modal-rating-label">Enjoyment</div>
                        <div className="modal-rating-stars">
                          {renderStars(selectedPlace.ratings.enjoyment ?? 0.0)}
                          <span className="modal-rating-number">{selectedPlace.ratings.enjoyment?.toFixed(1) ?? '0.0'}</span>
                        </div>
                      </div>
                      <div className="modal-rating-item">
                        <div className="modal-rating-label">Experience</div>
                        <div className="modal-rating-stars">
                          {renderStars(selectedPlace.ratings.experience)}
                          <span className="modal-rating-number">{selectedPlace.ratings.experience.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="modal-rating-item">
                        <div className="modal-rating-label">Value</div>
                        <div className="modal-rating-stars">
                          {renderStars(selectedPlace.ratings.value)}
                          <span className="modal-rating-number">{selectedPlace.ratings.value.toFixed(1)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-commentary-section">
                <div className="modal-commentary-content">
                  <p>{selectedPlace.commentary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places; 