const mysql = require('../database/mysql').pool;

exports.criarSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(
      `call pr_cria_sprint(?,?,?,?,?,?)`,
      [req.usuario.id_usuario, req.body.goal, req.body.dt_inicio, req.body.dt_fim, req.body.hora_inicio, req.body.hora_fim],
      (error, results, field) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          mensagem: results[0]
        }
        return res.status(200).send(response);
      });
  });
}

exports.adicionarUsuario = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario WHERE nome = ?', [req.body.nome], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Usuário não encontrado!' })
      } else {
        conn.query(
          `call pr_adiciona_usuario_sprint(?,?,?)`,
          [req.usuario.id_usuario, req.body.id_sprint, req.body.nome],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: results[0]
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
    conn.query('SELECT * FROM sprint WHERE id_usuario = ?', [req.usuario.id_usuario], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Você não tem Sprints cadastrada!' })
      } else {
        conn.query(
          `call bd_diet.pr_lista_sprint(?)`,
          [req.usuario.id_usuario],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                sprints: results[0]
            }
            return res.status(200).send(response);
          })
      }
    });
  });
}

exports.selecionarSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`SELECT * FROM sprint where id_sprint = ?`,
      [req.body.id_sprint],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length <= 0) {
          return res.status(404).send({
            mensagem: 'Sprint não encontrada!'
          })
        }
        const response = {
          sprint: result[0]
        }
        return res.status(200).send(response);
      });
  });
}

exports.excluiSprint = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM sprint WHERE id_sprint = ?', [req.body.id_sprint], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Sprint não encontrada!' })
      } else {
        conn.query(
          `DELETE FROM sprint WHERE id_sprint = ?`,
          [req.body.id_sprint],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: 'Sprint excluída com sucesso!'
            }
            return res.status(200).send(response);
          })
      }
    });
  });
}
