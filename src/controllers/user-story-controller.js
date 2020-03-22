const mysql = require('../database/mysql').pool;

exports.adicionarUserStory = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }

    conn.query(`select *
                from user_story
                where id_usuario = ?
                  and id_sprint = ?
                  and dt_user_story = ?
                  and hr_user_story = ?`,
      [req.body.id_usuario, req.body.id_sprint, req.body.dt_user_story, req.body.hr_user_story],
      (error, results) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (results.length >= 1) {
          res.status(409).send({ mensagem: 'User Story já cadastrada com os dados informados' })
        } else {
          conn.query(
            `call pr_cria_user_story_e_dependencias(?,?,?,?)`,
            [req.body.id_usuario, req.body.id_sprint, req.body.dt_user_story, req.body.hr_user_story],
            (error, field) => {
              conn.release();
              if (error) { return res.status(500).send({ error: error }) }
              const response = {
                mensagem: 'User Story cadastrada com sucesso',
                userStoryCadastrada: {
                  usuario: req.body.id_usuario,
                  sprint: req.body.sprint,
                  data: req.body.dt_user_story,
                  hora: req.body.hr_user_story
                }
              }
              return res.status(200).send(response);
            })
        }
      });
  });
}
