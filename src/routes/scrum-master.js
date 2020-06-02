const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const scrumMasterController = require('../controllers/scrumMaster-controller');

router.get('/', auth.obrigatorio, scrumMasterController.selecionarScrumMaster);

router.put('/tornarScrumMaster', auth.obrigatorio, scrumMasterController.tornarScrumMaster);

module.exports = router;
