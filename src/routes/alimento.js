const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const alimentoController = require('../controllers/alimento-controller');

router.get('/', auth.obrigatorio, alimentoController.selecionarAlimento);

module.exports = router;
