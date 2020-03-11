const express = require('express');
const router = express.Router();

//RETORNA TODOS OS PEDIDOS
router.get('/', (req, res, next) => {
    res.status(200).send({
        msg: 'GET OK'
    });
});

//INSERI UM PEDIDO
router.post('/', (req, res, next) => {
    res.status(201).send({
        msg: 'POST OK'
    });
});

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
    if (id == 'especial') {
        res.status(200).send({
            msg: 'ID ESPECIAL',
            id: id
        });
    }else{
        res.status(200).send({
            msg: 'ID COMUM'
        });
    }
});

//ALTERA UM PEDIDO
router.patch('/', (req, res, next) => {
    res.status(201).send({
        msg: 'PACTH OK'
    });
});

//EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {
    res.status(201).send({
        msg: 'DELETE OK'
    });
});

module.exports = router;

