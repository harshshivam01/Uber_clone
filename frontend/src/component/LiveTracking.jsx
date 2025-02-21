import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const LiveTracking = ({ pickupLocation, dropLocation, showDirections, isDriver, currentLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const pickupMarker = useRef(null);
  const dropMarker = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const locationUpdateInterval = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation || [77.2090, 28.6139],
      zoom: 15,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
      }),
      'top-right'
    );

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.current.addControl(geolocateControl, 'top-right');

    // Wait for both style and map to load
    map.current.on('style.load', () => {
      setMapLoaded(true);
    });

    map.current.on('load', () => {
      // Add 3D building layer
      if (map.current.getStyle()) {
        map.current.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6
          }
        });
      }
    });

    return () => {
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current);
      }
      map.current?.remove();
    };
  }, []);

  // Update markers and route when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    if (pickupMarker.current) pickupMarker.current.remove();
    if (dropMarker.current) dropMarker.current.remove();

    // Add markers if locations are available
    if (pickupLocation) {
      const el = createCustomMarker('pickup');
      pickupMarker.current = new mapboxgl.Marker(el)
        .setLngLat(pickupLocation)
        .addTo(map.current);
    }

    if (dropLocation) {
      const el = createCustomMarker('drop');
      dropMarker.current = new mapboxgl.Marker(el)
        .setLngLat(dropLocation)
        .addTo(map.current);
    }

    // Draw route if both locations are available
    if (pickupLocation && dropLocation && mapLoaded) {
      drawRoute(pickupLocation, dropLocation);
    }
  }, [pickupLocation, dropLocation, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !showDirections || !pickupLocation) return;

    // If driver, draw route from current location to pickup
    if (isDriver && userLocation) {
      drawRoute(userLocation, pickupLocation);
    }
    // If pickup and drop locations exist, draw full route
    else if (pickupLocation && dropLocation) {
      drawRoute(pickupLocation, dropLocation);
    }
  }, [pickupLocation, dropLocation, userLocation, mapLoaded, showDirections, isDriver]);

  const drawRoute = async (start, end) => {
    if (!map.current || !mapLoaded) return;

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      // Remove existing route layer and source if they exist
      if (map.current.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Add the route source and layer
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#007AFF',
          'line-width': 4,
          'line-opacity': 0.75
        }
      });

      // Fit map to route bounds
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach(point => bounds.extend(point));
      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000
      });
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  // Update center when pickup location changes
  useEffect(() => {
    if (!map.current) return;

    if (pickupLocation) {
      map.current.flyTo({
        center: pickupLocation,
        zoom: 15
      });
    }
  }, [pickupLocation]);

  // Initialize location tracking
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    let watchId = null;

    const startLocationTracking = () => {
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
          distanceFilter: 10 // Only update if moved more than 10 meters
        };

        // First try to get a high-accuracy position
        const highAccuracyWatch = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, heading, accuracy, speed } = position.coords;
            
            // Changed accuracy threshold to 250 meters
            if (accuracy <= 250) {
              const newLocation = [longitude, latitude];
              setUserLocation(newLocation);
              updateUserMarker(newLocation, heading);
            }
          },
          (error) => {
            console.warn('High accuracy location failed, falling back to low accuracy');
            // Fall back to low accuracy if high accuracy fails
            startLowAccuracyTracking();
          },
          options
        );

        watchId = highAccuracyWatch;
      }
    };

    const startLowAccuracyTracking = () => {
      const lowAccuracyOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000
      };

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading, accuracy } = position.coords;
          const newLocation = [longitude, latitude];
          setUserLocation(newLocation);
          updateUserMarker(newLocation, heading);
        },
        (error) => {
          console.error('Geolocation error:', error);
          handleLocationError(error);
        },
        lowAccuracyOptions
      );
    };

    const updateUserMarker = (location, heading) => {
      if (!userMarker.current) {
        const el = createCustomMarker('user');
        userMarker.current = new mapboxgl.Marker({
          element: el,
          rotationAlignment: 'map',
          pitchAlignment: 'map'
        })
          .setLngLat(location)
          .addTo(map.current);
      } else {
        userMarker.current.setLngLat(location);
        if (heading !== null) {
          userMarker.current.setRotation(heading);
        }
      }

      // Smooth animation to follow user if no pickup location is set
      if (!pickupLocation && map.current) {
        map.current.easeTo({
          center: location,
          duration: 1000
        });
      }
    };

    const handleLocationError = (error) => {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.error("Location permission denied. Please enable location services.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.error("Location request timed out.");
          break;
        default:
          console.error("An unknown error occurred.");
      }
    };

    // Start tracking
    startLocationTracking();

    // Cleanup function
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (userMarker.current) {
        userMarker.current.remove();
      }
    };
  }, [map.current, mapLoaded, pickupLocation]);

  // Update map when current location changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !currentLocation) return;

    // Update user marker
    if (!userMarker.current) {
      const el = createCustomMarker('driver');
      userMarker.current = new mapboxgl.Marker({
        element: el,
        pitchAlignment: 'map',
        rotationAlignment: 'map'
      })
        .setLngLat(currentLocation)
        .addTo(map.current);
    } else {
      userMarker.current.setLngLat(currentLocation);
    }

    // Center map on current location if no route is being shown
    if (!pickupLocation && !dropLocation) {
      map.current.easeTo({
        center: currentLocation,
        duration: 1000
      });
    }
  }, [currentLocation, mapLoaded]);

  // Add custom marker styles
  const createCustomMarker = (type) => {
    const el = document.createElement('div');
    el.className = `custom-marker ${type}-marker`;
    
    switch(type) {
      case 'user':
        el.innerHTML = `
          <div class="marker-container">
            <div class="pulse"></div>
            <div class="marker car-marker"></div>
          </div>
        `;
        break;
      case 'pickup':
        el.innerHTML = `
          <div class="marker-container">
            <div class="marker pickup-marker"></div>
          </div>
        `;
        break;
      case 'drop':
        el.innerHTML = `
          <div class="marker-container">
            <div class="marker drop-marker"></div>
          </div>
        `;
        break;
    }
    
    return el;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default LiveTracking;

