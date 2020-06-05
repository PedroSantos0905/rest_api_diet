const mysql = require('../database/mysql').pool;

exports.selecionarData = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT DATE_FORMAT(now(), "%d/%m/%Y")DATA',
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length <= 0) {
          return res.status(404).send({
            mensagem: 'Data não encontrada'
          })
        }
        const response = {
          data: {
            dataAtual: result[0].DATA
          }
        }
        return res.status(200).send(response);
      });
  });
}
