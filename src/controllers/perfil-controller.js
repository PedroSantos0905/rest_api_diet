const mysql = require('../database/mysql').pool;

exports.selecionarPerfil = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
SELECT
      u.nome,
      u.email,
      u.idade,
      u.peso,
      u.altura,
      sx.ds_sexo,
      tc.tipo
FROM usuario as u
      inner join tipo_cadastro as tc on u.id_tipo_cadastro = tc.id_tipo_cadastro
      inner join sexo as sx on u.id_sexo = sx.id_sexo
where u.id_usuario = ?`,
      [req.usuario.id_usuario],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Perfil não encontrado'
          })
        }
        const response = {
          perfil: {
            nome: result[0].nome,
            email: result[0].email,
            idade: result[0].idade + ' Anos',
            peso: result[0].peso + ' Quilos',
            altura: result[0].altura + ' Centímetros',
            sexo: result[0].ds_sexo,
            tipo: result[0].tipo
          }
        }
        return res.status(200).send(response);
      });
  });
}
