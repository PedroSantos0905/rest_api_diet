const mysql = require('../database/mysql').pool;
require("dotenv").config();

exports.criarSprint = (req, res, next) => {
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
      });
  });
}

exports.adicionarUsuario = (req, res, next) => {
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
    });
  });
}

exports.listarSprints = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(
                         `SELECT sp.*
                          FROM sprint as sp
                          right join scrum_master as sm
                          on sp.id_scrum_master = sm.id_scrum_master
                          where sp.id_usuario = ?
                          order by sp.dt_inicio desc`,
      [req.usuario.id_usuario],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado sprint para esse scrum master'
          })
        }
        const response = {
          quantidade: result.length,
          sprints: result.map(sprint => {
            return {
              id_sprint: sprint.id_sprint,
              id_scrum_master: sprint.id_scrum_master,
              goal: sprint.goal,
              dt_inicio: sprint.dt_inicio,
              dt_fim: sprint.dt_fim,
              hora_inicio: sprint.hora_inicio,
              hora_fim: sprint.hora_fim
            }
          })
        }
        return res.status(200).send(response);
      });
  });
}

exports.selecionarSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(
                         `SELECT sp.*
                          FROM sprint as sp
                          right join scrum_master as sm
                          on sp.id_scrum_master = sm.id_scrum_master
                          where sp.id_sprint = ?
                          order by sp.dt_inicio desc`,
      [req.body.id_sprint],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado sprint para esse scrum master'
          })
        }
        const response = {
          sprint: {
            id_sprint: result[0].id_sprint,
            id_scrum_master: result[0].id_scrum_master,
            goal: result[0].goal,
            dt_inicio: result[0].dt_inicio,
            dt_fim: result[0].dt_fim,
            hora_inicio: result[0].hora_inicio,
            hora_fim: result[0].hora_fim
          }
        }
        return res.status(200).send(response);
      });
  });
}
