const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length > 0) {
        res.status(409).send({ mensagem: 'Usuário já cadastrado' })
      } else {
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
          if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
          conn.query(
            `INSERT INTO usuario (nome, email, senha, id_tipo_cadastro) VALUES (?,?,?,?)`,
            [req.body.nome, req.body.email, hash, req.body.id_tipo_cadastro],
            (error, results) => {
              conn.release();
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                mensagem: 'Cadastro realizado com sucesso',
                usuarioCriado: {
                  usuario: results.insertId,
                  nome: req.body.nome,
                  email: req.body.email,
                  tipo_cadastro: req.body.id_tipo_cadastro
                }
              }
              return res.status(201).send(response);
            });
        });
      }
    });

  });
}

exports.atualizarUsuarios = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario WHERE email = ?', [req.body.email], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length > 0) {
        res.status(409).send({ mensagem: 'Email não disponível' })
      } else {
        conn.query(
          `UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?`,
          [req.body.nome, req.body.email, req.usuario.id_usuario],
          (error, results) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
              mensagem: 'Cadastro alterado com sucesso',
              usuarioAlterado: {
                id_usuario: req.usuario.id_usuario,
                nome: req.body.nome,
                email: req.body.email
              }
            }
            return res.status(200).send(response);
          });
      }
    });

  });
}

exports.login = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    const query = `SELECT * FROM usuario WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release();
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          return res.status(401).send({ mensagem: 'Falha na autenticação' })
        }
        if (result) {
          const token = jwt.sign({
            id_usuario: results[0].id_usuario,
            email: results[0].email
          }, process.env.JWT_KEY,
            {
              expiresIn: "1h"
            });
          return res.status(200).send({
            mensagem: 'Autenticado com sucesso',
            usuario: results[0].id_usuario,
            token: token
          });
        }
        return res.status(401).send({ mensagem: 'Falha na autenticação' })
      });
    });
  });
}

exports.dadosTmbCadastro = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(
      `call pr_atualiza_perfil_inseri_hist_perfil(?,?,?,?,?)`,
      [req.usuario.id_usuario, req.body.idade, req.body.peso, req.body.altura, req.body.sexo],
      (error, field) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          mensagem: 'Perfil cadastrado com sucesso',
          perfilCriado: {
            usuario: req.usuario.id_usuario,
            sexo: req.body.id_sexo,
            idade: req.body.idade,
            peso: req.body.peso,
            altura: req.body.altura
          }
        }
        return res.status(200).send(response);
      });
  });
}
