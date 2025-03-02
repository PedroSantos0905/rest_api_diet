const mysql = require('../database/mysql').pool;

exports.cadastrarRefeicaoUsuario = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM refeicao_usuario WHERE nm_refeicao = ? and id_usuario = ? and dt_refeicao = ? and hr_refeicao = ?',
      [req.body.nm_refeicao, req.usuario.id_usuario, req.body.dt_refeicao, req.body.hr_refeicao], (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length > 0) {
          res.status(409).send({ mensagem: 'Refeição já cadastrada!' })
        } else {
          conn.query(
            `call bd_diet.pr_cria_refeicao_usuario(?, ?, ?, ?, ?)`,
            [req.body.nm_refeicao, req.usuario.id_usuario, req.body.id_alimentos, req.body.dt_refeicao, req.body.hr_refeicao],
            (error, results) => {
              conn.release();
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                mensagem: 'Refeição cadastrada com sucesso!',
                refeicao: {
                  nome: req.body.nm_refeicao,
                  usuario: req.usuario.id_usuario,
                  alimentos: req.body.id_alimentos,
                  data: req.body.dt_refeicao,
                  hora: req.body.hr_refeicao
                }
              }
              return res.status(201).send(response);
            });
        }
      });

  });
}

exports.listarRefeicao = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
    select
        id_refeicao_usuario,
        id_refeicao,
        nm_refeicao,
        id_usuario,
        id_alimentos,
        DATE_FORMAT (dt_refeicao,'%d/%m/%Y') AS dt_refeicao,
        DATE_FORMAT (hr_refeicao,'%Hh%i') AS hr_refeicao,
        calorias_refeicao
    from refeicao_usuario
    where id_usuario = ? order by dt_refeicao desc, hr_refeicao asc;
    `,
      [req.usuario.id_usuario],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não há refeições cadastradas!'
          })
        }
        const response = {
          refeicoes: result.map(refeicao => {
            return {
              id_refeicao: refeicao.id_refeicao,
              id_usuario: refeicao.id_usuario,
              nome: refeicao.nm_refeicao,
              data: refeicao.dt_refeicao,
              hora: refeicao.hr_refeicao,
              calorias: refeicao.calorias_refeicao,
            }
          })
        }
        return res.status(200).send(response);
      });
  });
}

exports.listarRefeicaoDia = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM refeicao_usuario where id_usuario = ? and dt_refeicao = (SELECT DATE_FORMAT(now(), "%Y-%m-%d")DATA) order by dt_refeicao desc, hr_refeicao asc',
      [req.usuario.id_usuario],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não há refeições cadastradas!'
          })
        }
        const response = {
          refeicoes: result.map(refeicao => {
            return {
              id_refeicao: refeicao.id_refeicao,
              id_usuario: refeicao.id_usuario,
              nome: refeicao.nm_refeicao,
              data: refeicao.dt_refeicao,
              hora: refeicao.hr_refeicao,
              calorias: refeicao.calorias_refeicao,
            }
          })
        }
        return res.status(200).send(response);
      });
  });
}

exports.selecionarRefeicao = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('select * from refeicao_usuario where id_refeicao = ?',
      [req.body.id_refeicao],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Refeição não encontrada!'
          })
        }
        const response = {
          refeicao: {
            id_refeicao: result[0].id_refeicao,
            nome: result[0].nm_refeicao,
            alimentos: result[0].id_alimentos,
            data: result[0].dt_refeicao,
            hora: result[0].hr_refeicao
          }
        }
        return res.status(200).send(response);
      });
  });
}

exports.listarAlimentoRefeicao = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM refeicao_usuario WHERE id_refeicao = ?',
      [req.body.id_refeicao], (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length <= 0) {
          res.status(404).send({ mensagem: 'Refeição não encontrada!' })
        } else {
          conn.query(`call pr_lista_alimentos_refeicao_usuario(?)`,
            [req.body.id_refeicao],
            (error, results) => {
              conn.release();
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                alimentos: results[0]
              }
              return res.status(200).send(response);
            });
        }
      });
  });
}

exports.AlterarRefeicaoUsuario = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM refeicao_usuario WHERE nm_refeicao = ? and id_usuario = ? and dt_refeicao = ? and hr_refeicao = ?',
      [req.body.nm_refeicao, req.usuario.id_usuario, req.body.dt_refeicao, req.body.hr_refeicao], (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length > 0) {
          res.status(409).send({ mensagem: 'Já existe refeição cadastrada com os dados informados!' })
        } else {
          conn.query(
            `call bd_diet.pr_atualiza_refeicao_usuario(?, ?, ?, ?, ?, ?)`,
            [req.body.id_refeicao, req.body.nm_refeicao, req.usuario.id_usuario, req.body.id_alimentos, req.body.dt_refeicao, req.body.hr_refeicao],
            (error, results) => {
              conn.release();
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                mensagem: 'Refeição alterada com sucesso!',
                refeicao: {
                  id_refeicao: req.body.id_refeicao,
                  nome: req.body.nm_refeicao,
                  usuario: req.usuario.id_usuario,
                  alimentos: req.body.id_alimentos,
                  data: req.body.dt_refeicao,
                  hora: req.body.hr_refeicao
                }
              }
              return res.status(200).send(response);
            });
        }
      });

  });
}

exports.ExcluirRefeicaoUsuario = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM refeicao_usuario WHERE id_refeicao = ? and id_usuario = ?',
      [req.body.id_refeicao, req.usuario.id_usuario], (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length <= 0) {
          res.status(404).send({ mensagem: 'Refeição não encontrada' })
        } else {
          conn.query('delete from refeicao_usuario where id_refeicao = ? and id_usuario = ?',
            [req.body.id_refeicao, req.usuario.id_usuario],
            (error, result, fields) => {
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                mensagem: 'Refeição excluída com sucesso!'
              }
              return res.status(200).send(response);
            });
        }
      });
  });
}
