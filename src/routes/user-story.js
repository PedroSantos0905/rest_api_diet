const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const userstoryController = require('../controllers/user-story-controller');

router.put('/', auth.obrigatorio, userstoryController.adicionarUserStory);

module.exports = router;
