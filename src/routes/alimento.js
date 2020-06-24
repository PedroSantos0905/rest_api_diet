const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const alimentoController = require('../controllers/alimento-controller');

router.get('/', auth.obrigatorio, alimentoController.pesquisarAlimento);

router.get('/selecionar', auth.obrigatorio, alimentoController.selecionarAlimento);

router.get('/listarAlimento', auth.obrigatorio, alimentoController.listarAlimento);

module.exports = router;
