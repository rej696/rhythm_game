const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');

// router.get('/say-something', controllers.saySomething);
router.get('/get-highscore', controllers.getHighScore);
router.get('/get-scores', controllers.getScores);

// post?
router.get('/add-score', controllers.addScore);

module.exports = router;