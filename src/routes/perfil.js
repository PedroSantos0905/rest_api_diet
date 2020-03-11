const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;

router.post('/', (req, res, next) => {
mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
        conn.query(
            `INSERT INTO perfil (idade, peso, altura, sexo, id_usuario) VALUES (?,?,?,?,?)`,
            [req.body.idade, req.body.peso, req.body.altura, req.body.sexo, req.body.id_usuario],
            (error, results, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Perfil cadastrado com sucesso',
                    perfilCriado: {
                        id_perfil: results.insertId,
                        id_usuario: req.body.id_usuario
                    }
                }
            return res.status(201).send(response);
        })
    });
});

module.exports = router;