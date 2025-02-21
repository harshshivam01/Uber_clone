const axios = require('axios');
const dotenv = require('dotenv');
const Captain = require('../models/captain.model');
dotenv.config();

module.exports.getAddressCoordinates = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${process.env.MAPBOX_API_KEY}`;

    try {
        console.log('Requesting coordinates for address:', address);
        console.log('API URL (without key):', url.replace(process.env.MAPBOX_API_KEY, 'HIDDEN_KEY'));

        const response = await axios.get(url);
        console.log('API Response:', JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.features || response.data.features.length === 0) {
            console.log('API returned no results. Response status:', response.data.message || 'No features found');
            throw new Error(`No results found for address: ${address}`);
        }

        const [lng, lat] = response.data.features[0].center; // Mapbox returns [lng, lat] instead of [lat, lng]

        return { lat, lng };
    } catch (error) {
        if (error.response) {
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Request setup error:', error.message);
        }

        if (!process.env.MAPBOX_API_KEY) {
            throw new Error('Mapbox API key is not configured');
        }

        throw new Error(error.response?.data?.message || error.message || 'Unable to fetch coordinates');
    }
};

module.exports.getDistanceTime = async (start, end) => {    
    console.log(start,end);
    if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
        throw new Error('Invalid start or end coordinates.');
    }

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&steps=true&access_token=${process.env.MAPBOX_API_KEY}`;

    try {
        console.log('Requesting distance and time for:', start, '→', end);
        console.log('API URL:', url.replace(process.env.MAPBOX_API_KEY, 'HIDDEN_KEY'));

        const response = await axios.get(url);
       

        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error('No routes found for the given locations.');
        }
        if (!response.data.routes[0].legs || response.data.routes[0].legs.length === 0) {
            throw new Error('No legs found in the route.');
        }

        const { distance, duration } = response.data.routes[0].legs[0];
        return { distance, duration };
    } catch (error) {
        console.error('Error in getDistanceTime:', error.message);
        
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            throw new Error(error.response.data.message || `API Error: ${error.response.status}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from Mapbox API');
        } else {
            console.error('Request setup error:', error.message);
            throw new Error(error.message);
        }
    }
};

module.exports.getSuggestion = async (address) => {
    
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.MAPBOX_API_KEY}`;
    try {
        const response = await axios.get(url);
      
        return response.data;
    } catch (error) {
        console.error('Error in getSuggestion:', error.message);
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            throw new Error(error.response.data.message || `API Error: ${error.response.status}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response received from Mapbox API');
        } else {
            console.error('Request setup error:', error.message);
            throw new Error(error.message);
        }
    }
};

module.exports.findCaptainsInRadius = async (pickup, radius) => {
    if (!pickup) {
        throw new Error("Pickup location is required");
    }

    try {
        // Get coordinates of the pickup location
        const pickupCoords = await module.exports.getAddressCoordinates(pickup);
        if (!pickupCoords) {
            throw new Error("Could not get coordinates for pickup location");
        }

        const { lat, lng } = pickupCoords;
        console.log('Searching for captains near:', { lat, lng });
        const searchRadius = parseFloat(radius) || 5; // Default radius: 5 km

        // Find captains within radius using MongoDB's geospatial query
        const captains = await Captain.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lng, lat],
                        searchRadius / 6371 // Convert km to radians
                    ]
                }
            }
        }).select('fullname vehicle location socketId'); // Ensure socketId is selected

        console.log('Found captains:', captains.length);

        if (!captains.length) {
            return {
                count: 0,
                message: "No captains found in the specified range",
                captains: []
            };
        }

        // Calculate distance for each captain and sort by proximity
        const captainsWithDistance = captains.map(captain => {
            const distance = calculateDistance(
                lat,
                lng,
                captain.location.coordinates[1],
                captain.location.coordinates[0]
            );
            return {
                ...captain.toObject(),
                distance: parseFloat(distance.toFixed(2)),
                socketId: captain.socketId // Ensure socketId is included
            };
        }).sort((a, b) => a.distance - b.distance);

        console.log('Captains with distances:', 
            captainsWithDistance.map(c => ({
                name: c.fullname,
                distance: c.distance,
                socketId: c.socketId,
                coordinates: c.location.coordinates
            }))
        );

        return {
            count: captains.length,
            message: "Captains found successfully",
            captains: captainsWithDistance
        };

    } catch (error) {
        console.error('Error in findCaptainsInRadius:', error);
        throw error;
    }
};


// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const toRad = (value) => {
    return value * Math.PI / 180;
};
