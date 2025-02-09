const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Existing routes
router.post('/', gameController.startGame);
router.post('/join', gameController.joinGame);
router.post('/setsecret', gameController.setSecretCode);
router.post('/guess', gameController.submitGuess);
router.get('/:gameId', gameController.getGameData);
router.post('/end', gameController.endGame);
router.post('/quitGame', gameController.quitGame);

module.exports = router;
