const mysql = require('../database/mysql').pool;

exports.selecionarScrumMaster = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
  SELECT
      u.nome,
      tc.tipo
  FROM usuario as u
      inner join scrum_master as sm on u.id_usuario = sm.id_usuario
      inner join tipo_cadastro as tc on tc.id_tipo_cadastro = u.id_tipo_cadastro
  where u.id_usuario in (
    select u.id_usuario from scrum_master as sm inner join usuario as u on u.id_usuario = sm.id_usuario
  ) and u.id_tipo_cadastro = '2'`,
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não há Scrum Master no momento'
          })
        }
        const response = {
          quantidade: result.length,
          scrumMaster: result.map(scrumMaster => {
            return {
              nome: scrumMaster.nome,
              tipo: scrumMaster.tipo
            }
          })}
        return res.status(200).send(response);
      });
  });
}
