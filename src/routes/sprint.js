const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const auth = require('../midlleware/auth');
require("dotenv").config();


router.put('/', auth.obrigatorio, (req, res, next) => {
    console.log(req.usuario)
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query(
            `call pr_cria_sprint_e_dependencias(?,?,?,?,?,?)`,
            [req.usuario.id_usuario, req.body.goal, req.body.dt_inicio, req.body.dt_fim, req.body.hora_inicio, req.body.hora_fim],
            (error, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Script criada com sucesso',
                    sprintCriada: {
                        usuario: req.usuario.id_usuario,
                        goal: req.body.goal,
                        dt_inicio: req.body.dt_inicio,
                        dt_fim: req.body.dt_fim,
                        hora_inicio: req.body.hora_inicio,
                        hora_fim: req.body.hora_fim
                    }
                }
                return res.status(200).send(response);
            })
    });
});

module.exports = router;