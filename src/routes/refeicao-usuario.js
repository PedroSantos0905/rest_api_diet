const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const refeicaoUsuarioController = require('../controllers/refeicao-usuario-controller');

router.put('/', auth.obrigatorio, refeicaoUsuarioController.cadastrarRefeicaoUsuario);

module.exports = router;
