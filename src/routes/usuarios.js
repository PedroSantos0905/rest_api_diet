const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const usuariosController = require('../controllers/usuarios-controller');

router.post('/', usuariosController.cadastrarUsuario);

router.put('/atualizar', auth.obrigatorio, usuariosController.atualizarUsuarios);

router.post('/login', usuariosController.login);

router.put('/dadosTmb', auth.obrigatorio, usuariosController.dadosTmbCadastro);

module.exports = router;
