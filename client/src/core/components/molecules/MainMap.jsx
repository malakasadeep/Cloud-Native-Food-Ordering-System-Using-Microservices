import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaSearch } from 'react-icons/fa';

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 6.916810,
  lng: 79.975045 // Colombo, Sri Lanka
};

const MainMap = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim() || !isLoaded || !window.google) return;
    
    setIsSearching(true);
    const service = new window.google.maps.places.PlacesService(map);
    
    service.textSearch({ query: searchQuery }, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    });
  };

  const handleLocationSelect = (place) => {
    if (!place.geometry || !place.geometry.location) return;
    
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    
    setCenter(location);
    setMarkers([{ position: location, name: place.name }]);
    setSearchResults([]);
    setSearchQuery(place.name);
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg relative">
      {!isLoaded ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <p className="text-gray-500">Loading Map...</p>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
          }}
        >
          {markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={marker.position}
              title={marker.name}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default MainMap;
