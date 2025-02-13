const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports.getAddressCoordinates = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_MAP_API}`;

    try {
        console.log('Requesting coordinates for address:', address);
        console.log('API URL (without key):', url.replace(process.env.GOOGLE_MAP_API, 'HIDDEN_KEY'));
        
        const response = await axios.get(url);
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        
        if (!response.data || !response.data.results || response.data.results.length === 0) {
            console.log('API returned no results. Response status:', response.data.status);
            throw new Error(`No results found for address: ${address}`);
        }

        if (!response.data.results[0].geometry || !response.data.results[0].geometry.location) {
            throw new Error('Invalid response structure from Google Maps API');
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
        }

        if (!process.env.GOOGLE_MAP_API) {
            throw new Error('Google Maps API key is not configured');
        }

        throw new Error(error.response?.data?.error_message || error.message || 'Unable to fetch coordinates');
    }
}