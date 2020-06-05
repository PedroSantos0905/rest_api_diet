const mysql = require('../database/mysql').pool;

exports.tmbAtual = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario WHERE id_usuario = ?', [req.usuario.id_usuario], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(409).send({ mensagem: 'Usuário não encontrado' })
      } else {
        conn.query(`call pr_lista_tmb_atual(?)`,
          [req.usuario.id_usuario],
          (error, results) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
              tmb: results[0]
            }
            return res.status(200).send(response);
          });
      }
    });

  });
}
