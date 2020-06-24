const mysql = require('../database/mysql').pool;

exports.pesquisarAlimento = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
SELECT
      al.id_alimento,
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
              id_alimento: alimento.id_alimento,
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

exports.listarAlimento = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
SELECT
    al.id_alimento,
    al.alimento,
    al.quantidade,
    al.caloria,
    tal.tipo
FROM alimentos as al
inner join tipo_alimento as tal on al.tipo_alimento = tal.id_tipo_alimento`,
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Alimentos não encontrados!'
          })
        }
        const response = {
          alimento: result.map(alimento => {
            return {
              id_alimento: alimento.id_alimento,
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

exports.selecionarAlimento = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
SELECT
      al.id_alimento,
      al.alimento,
      al.quantidade,
      al.caloria,
      tal.tipo
FROM alimentos as al
      inner join tipo_alimento as tal on al.tipo_alimento = tal.id_tipo_alimento
where id_alimento = ?`,
      [req.body.id_alimento],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Alimento não encontrado!'
          })
        }
        const response = {
              id_alimento: result[0].id_alimento,
              nome: result[0].alimento,
              quantidade: result[0].quantidade,
              caloria: result[0].caloria + ' Calorias',
              tipo: result[0].tipo
          }
        return res.status(200).send(response);
      });
  });
}
