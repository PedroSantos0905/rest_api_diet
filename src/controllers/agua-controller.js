const mysql = require('../database/mysql').pool;

exports.cadastrarConsumo = (req, res, next) => {
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
}

exports.atualizarConsumo = (req, res, next) => {
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
}

exports.excluirConsumo = (req, res, next) => {
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
}

exports.listarConsumo = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM agua where fk_usuario_agua = ?',
      [req.usuario.id_usuario],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado consumo de água para esse usuário'
          })
        }
        const response = {
          quantidade: result.length,
          sprints: result.map(agua => {
            return {
              id_agua: agua.id_agua,
              fk_usuario_agua: agua.fk_usuario_agua,
              mililitro: agua.mililitro,
              hora: agua.hora,
              alarme: agua.alarme
            }
          })
        }
        return res.status(200).send(response);
      });
  });
}

exports.selecionarConsumo = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM agua where id_agua = ?',
      [req.body.id_agua],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Consumo não encontrado'
          })
        }
        const response = {
          agua: {
            id_agua: result[0].id_agua,
            fk_usuario_agua: result[0].fk_usuario_agua,
            mililitro: result[0].mililitro,
            hora: result[0].hora,
            alarme: result[0].alarme
          }
        }
        return res.status(200).send(response);
      });
  });
}
