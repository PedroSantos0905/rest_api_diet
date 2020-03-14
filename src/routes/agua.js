const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const auth = require('../midlleware/auth');

router.post('/', auth.obrigatorio, (req, res, next) => {
    console.log(req.usuario)
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM agua WHERE mililitro = ? and fk_usuario_agua = ?',
        [req.body.mililitro, req.body.fk_usuario_agua], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(409).send({ mensagem: 'Consumo já cadastrado' })
            } else {
                conn.query(
                    `INSERT INTO agua (fk_usuario_agua, mililitro, hora, alarme) VALUES (?,?,?,?)`,
                    [req.usuario.id_usuario, req.body.mililitro, req.body.hora, req.body.alarme],
                    (error, results) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                             mensagem: 'Consumo de água cadastrado com sucesso',
                            consumoAguaCadastrado: {
                                id_agua: results.insertId,
                                fk_usuario_agua: req.usuario.id_usuario,
                                mililitro: req.body.mililitro,
                                hora: req.body.hora,
                                alarme: req.body.alarme
                            }
                        }
                        return res.status(201).send(response);
                    });
            }
        })

    });
});

router.put('/atualizar', auth.obrigatorio, (req, res, next) => {
    console.log(req.usuario)
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM agua WHERE id_agua = ?', [req.body.id_agua], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length <= 0) {
                res.status(409).send({ mensagem: 'Consumo não encontrato' })
            } else {
                conn.query(
                    `UPDATE agua SET mililitro = ?, hora = ?, alarme = ? WHERE id_agua = ?`,
                    [req.body.mililitro, req.body.hora, req.body.alarme, req.body.id_agua],
                    (error, results) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                            mensagem: 'Consumo alterado com sucesso',
                            usuarioAlterado: {
                                id_agua: req.body.id_agua,
                                mililitro: req.body.mililitro,
                                hora: req.body.hora,
                                alarme: req.body.alarme
                            }
                        }
                        return res.status(200).send(response);
                    });
            }
        })

    });
});

router.delete('/excluir', auth.obrigatorio, (req, res, next) => {
    console.log(req.usuario)
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM agua WHERE id_agua = ?',
        [req.body.id_agua], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length <= 0) {
                res.status(409).send({ mensagem: 'Consumo de água não encontrado' })
            } else {
                conn.query(
                    `DELETE FROM agua WHERE id_agua = ?`,
                    [req.body.id_agua],
                    (error, results) => {
                        conn.release();
                        if (error) { return res.status(500).send({ error: error }) }
                        const response = {
                             mensagem: 'Consumo de água excluído com sucesso',
                        }
                        return res.status(200).send(response);
                    });
            }
        })

    });
});

module.exports = router;