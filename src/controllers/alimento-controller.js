const mysql = require('../database/mysql').pool;

exports.selecionarAlimento = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
SELECT
      al.alimento,
      al.quantidade,
      al.caloria,
      tal.tipo
FROM alimentos as al
      inner join tipo_alimento as tal on al.tipo_alimento = tal.id_tipo_alimento
where alimento like ?`,
      [req.body.alimento],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Alimento não encontrado!'
          })
        }
        const response = {
          alimento: result.map(alimento => {
            return {
              nome: alimento.alimento,
              quantidade: alimento.quantidade,
              caloria: alimento.caloria + ' Calorias',
              tipo: alimento.tipo
            }
          })}
        return res.status(200).send(response);
      });
  });
}
