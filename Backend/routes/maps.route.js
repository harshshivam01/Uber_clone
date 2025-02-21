const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapsController = require('../controllers/maps.controller');
const { query } = require('express-validator');


router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser, mapsController.getCoordinates);

router.get('/get-distance-time',
    query('start').isString().isLength({ min: 3 }),
    query('end').isString().isLength({ min: 3 }),
    authMiddleware.authUser, mapsController.getDistanceTime);   

router.get('/get-suggestion',
    query('address').isString().isLength({ min: 1 }),
    authMiddleware.authUser, mapsController.getSuggestion);



module.exports = router;