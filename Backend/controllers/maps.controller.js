const mapService = require('../services/maps.service');

module.exports.getCoordinates = async (req, res,next) => {
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
