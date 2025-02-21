const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");



module.exports.getCoordinates = async (req, res, next) => {
  const { error } = validationResult(req);
  if (error) {
    return res.status(400).json({ errors: error.array() });
  }
  const { address } = req.query;
  try {
    const coordinates = await mapService.getAddressCoordinates(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  const { error } = validationResult(req);
  if (error) {
    return res.status(400).json({ errors: error.array() });
  }
  const { start, end } = req.query;
  try {
    const startCoordinates = await mapService.getAddressCoordinates(start);
    const endCoordinates = await mapService.getAddressCoordinates(end);
    const distanceTime = await mapService.getDistanceTime(
      startCoordinates,
      endCoordinates
    );

    res.status(200).json(distanceTime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getSuggestion = async (req, res, next) => {
  const { error } = validationResult(req);
  if (error) {
    return res.status(400).json({ errors: error.array() });
  }
  const { address } = req.query;
  try {
    const suggestion = await mapService.getSuggestion(address);
    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

