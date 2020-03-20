const express = require('express');
const router = express.Router();
const auth = require('../midlleware/auth');
const aguaController = require('../controllers/agua-controller');

router.post('/', auth.obrigatorio, aguaController.cadastrarConsumo);

router.put('/atualizar', auth.obrigatorio, aguaController.atualizarConsumo);

router.delete('/excluir', auth.obrigatorio, aguaController.excluirConsumo);

router.get('/listar', auth.obrigatorio, aguaController.listarConsumo);

router.get('/selecionar', auth.obrigatorio, aguaController.selecionarConsumo);

module.exports = router;
