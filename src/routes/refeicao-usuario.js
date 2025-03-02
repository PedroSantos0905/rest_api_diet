const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const refeicaoUsuarioController = require('../controllers/refeicao-usuario-controller');

router.put('/', auth.obrigatorio, refeicaoUsuarioController.cadastrarRefeicaoUsuario);

router.get('/refeicoes', auth.obrigatorio, refeicaoUsuarioController.listarRefeicao);

router.get('/refeicoesDia', auth.obrigatorio, refeicaoUsuarioController.listarRefeicaoDia);

router.get('/alimentosRefeicao', auth.obrigatorio, refeicaoUsuarioController.listarAlimentoRefeicao);

router.get('/selecionarRefeicao', auth.obrigatorio, refeicaoUsuarioController.selecionarRefeicao);

router.put('/alterarRefeicaoUsuario', auth.obrigatorio, refeicaoUsuarioController.AlterarRefeicaoUsuario);

router.delete('/excluirRefeicaoUsuario', auth.obrigatorio, refeicaoUsuarioController.ExcluirRefeicaoUsuario);

module.exports = router;
