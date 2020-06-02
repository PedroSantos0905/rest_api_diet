const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const sprintsController = require('../controllers/sprints-controllers');

router.put('/', auth.obrigatorio, sprintsController.criarSprint);

router.put('/adicionarUsuario', auth.obrigatorio, sprintsController.adicionarUsuario);

router.get('/listar', auth.obrigatorio, sprintsController.listarSprints);

router.get('/selecionar', auth.obrigatorio, sprintsController.selecionarSprint);

router.delete('/excluir', auth.obrigatorio, sprintsController.excluiSprint);

module.exports = router;
