const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const tmbAtualController = require('../controllers/tmb-atual-controller');

router.get('/', auth.obrigatorio, tmbAtualController.tmbAtual);

module.exports = router;
