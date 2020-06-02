const mysql = require('../database/mysql').pool;

exports.selecionarScrumMaster = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`SELECT us.id_usuario, us.nome, us.email, us.idade, sx.ds_sexo FROM usuario us join sexo sx on us.id_sexo = sx.id_sexo
    where us.id_tipo_cadastro = 2`,
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length <= 0) {
          return res.status(404).send({
            mensagem: 'Não há Scrum Master no momento!'
          })
        }
        const response = {
          quantidade: result.length,
          scrumMaster: result.map(scrumMaster => {
            return {
              id_usuario: scrumMaster.id_usuario,
              nome: scrumMaster.nome,
              email: scrumMaster.email,
              idade: scrumMaster.idade + ' Anos',
              sexo: scrumMaster.ds_sexo,
            }
          })
        }
        return res.status(200).send(response);
      });
  });
}

exports.tornarScrumMaster = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario where id_tipo_cadastro = 2 and id_usuario = ?',
      [req.usuario.id_usuario], (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length > 0) {
          res.status(409).send({ mensagem: 'Você já é um Scrum Master!' })
        } else {
          conn.query('update usuario set id_tipo_cadastro = 2 where id_usuario = ?',
            [req.usuario.id_usuario],
            (error, result, fields) => {
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                mensagem: "Parabéns agora você é um Scrum Master!"
              }
              return res.status(200).send(response);
            });
        }
      });
  });
}
