const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const perfilController = require('../controllers/perfil-controller');

router.get('/', auth.obrigatorio, perfilController.selecionarPerfil);

module.exports = router;
