import React from 'react';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const MapComponent = ({
  mapCenter,
  setMapCenter,
  markerPosition,
  setMarkerPosition,
  handleMapClick,
  handleMarkerDragEnd,
  getCurrentLocation,
  isLocating,
  loadError,
  isLoaded,
  searchBoxRef,
  onPlacesChanged,
  mapContainerStyle,
}) => (
  <div style={{ ...mapContainerStyle, position: "relative" }}>
    {!isLoaded ? (
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(241,241,241,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cartNumBg mx-auto mb-2"></div>
          <div>{loadError ? "Failed to load Google Maps." : "Loading Google Maps..."}</div>
        </div>
      </div>
    ) : (
      <>
        {/* Search bar - top center */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            width: "max-content"
          }}
        >
          <StandaloneSearchBox
            onLoad={ref => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for a location"
              style={{
                boxSizing: `border-box`,
                border: `1px solid #ccc`,
                width: `300px`,
                height: `40px`,
                padding: `0 12px`,
                borderRadius: `4px`,
                background: "#fff",
                fontSize: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            />
          </StandaloneSearchBox>
        </div>
        {/* Current Location Button - bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            zIndex: 100,
          }}
        >
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLocating}
            style={{
              background: "#1976D2",
              color: "white",
              padding: "0 16px",
              height: "40px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: isLocating ? 0.7 : 1,
              fontWeight: 500,
              fontSize: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            {isLocating ? "Locating..." : "Current Location"}
          </button>
        </div>
        
        {/* Center Pointer - fixed in the middle of the map */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -100%)",
            zIndex: 99,
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50% 50% 50% 0",
              background: "#FF5722",
              transform: "rotate(-45deg)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "white",
              position: "absolute",
              top: "6px", 
              left: "6px",
              transform: "rotate(45deg)"
            }}
          />
        </div>
        
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          onClick={handleMapClick}
          onIdle={(map) => {
            // Update marker position to map center when map stops moving
            const newCenter = map.getCenter();
            if (newCenter) {
              const newPos = { 
                lat: newCenter.lat(), 
                lng: newCenter.lng() 
              };
              setMarkerPosition(newPos);
              setMapCenter(newPos);
            }
          }}
          options={{
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            gestureHandling: 'greedy',
          }}
        >
          {/* Hide the draggable marker since we're using the center pointer */}
          {/* <Marker
            position={markerPosition}
            draggable
            onDragEnd={handleMarkerDragEnd}
          /> */}
        </GoogleMap>
      </>
    )}
  </div>
);

export default MapComponent;
