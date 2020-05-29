const mysql = require('../database/mysql').pool;

exports.cadastrarRefeicaoUsuario = (req, res, next) => {
    console.log(req.usuario)
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM refeicao_usuario WHERE nm_refeicao = ? and id_usuario = ? and dt_refeicao = ? and hr_refeicao = ?',
        [req.body.nm_refeicao, req.usuario.id_usuario, req.body.dt_refeicao, req.body.hr_refeicao], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
              res.status(409).send({ mensagem: 'Refeição já cadastrada' })
            } else {
        conn.query(
            `call bd_diet.pr_cria_refeicao_usuario(?, ?, ?, ?, ?)`,
            [req.body.nm_refeicao, req.usuario.id_usuario, req.body.id_alimentos, req.body.dt_refeicao, req.body.hr_refeicao],
            (error, results) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Refeição cadastrada com sucesso',
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