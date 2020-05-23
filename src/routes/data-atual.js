const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const dataAtualcontroller = require('../controllers/dataAtual-controller');

router.get('/', auth.obrigatorio, dataAtualcontroller.selecionarData);

module.exports = router;
