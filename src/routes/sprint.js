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

router.put('/adicionarUsuario', auth.obrigatorio, (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
      if (err) { return res.status(500).send({ error: error }) }

      conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length <= 0) {
            res.status(404).send({ mensagem: 'Usuário não cadastrado' })
          } else {
      conn.query(
          `call pr_adiciona_usuario_sprint(?,?,?)`,
          [req.usuario.id_usuario, req.body.id_sprint, req.body.email],
          (error, field) => {
              conn.release();
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                  mensagem: 'Usuário adicionado com sucesso',
                  usuarioAdicionado: {
                      usuario: req.body.email,
                      sprint: req.body.sprint
                  }
              }
              return res.status(200).send(response);
          })
        }
      })
  });
});

module.exports = router;
