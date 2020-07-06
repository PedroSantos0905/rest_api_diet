const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const sprintsController = require('../controllers/sprints-controllers');

router.put('/', auth.obrigatorio, sprintsController.criarSprint);

router.put('/adicionarUsuario', auth.obrigatorio, sprintsController.adicionarUsuario);

router.put('/entrarSprint', auth.obrigatorio, sprintsController.entrarSprint);

router.get('/listar', auth.obrigatorio, sprintsController.listarSprints);

router.get('/listarMinhasSprints', auth.obrigatorio, sprintsController.listarMinhasSprints);

router.get('/selecionar', auth.obrigatorio, sprintsController.selecionarSprint);

router.delete('/excluir', auth.obrigatorio, sprintsController.excluiSprint);

router.get('/listarParticipantes', auth.obrigatorio, sprintsController.listarParticipantes);

router.put('/cadastrarRefeicaoSprint', auth.obrigatorio, sprintsController.cadastrarRefeicaoSprint);

router.get('/listarRefeicaoParticipanteSprint', auth.obrigatorio, sprintsController.listarRefeicaoParticipanteSprint);

router.get('/selecionarRefeicaoParticipanteSprint', auth.obrigatorio, sprintsController.selecionarRefeicaoParticipanteSprint);

router.get('/listarAlimentoRefeicaoParticipanteSprint', auth.obrigatorio, sprintsController.listarAlimentoRefeicaoParticipanteSprint);

router.get('/listarRefeicaoSprint', auth.obrigatorio, sprintsController.listarRefeicaoSprint);

router.get('/selecionarRefeicaoSprint', auth.obrigatorio, sprintsController.selecionarRefeicaoSprint);

router.put('/atualizarRefeicaoSprint', auth.obrigatorio, sprintsController.atualizarRefeicaoSprint);

router.delete('/excluirRefeicaoSprint', auth.obrigatorio, sprintsController.excluirRefeicaoSprint);

module.exports = router;
