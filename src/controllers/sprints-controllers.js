const mysql = require('../database/mysql').pool;

exports.criarSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(
      `call pr_cria_sprint(?,?,?,?,?,?)`,
      [req.usuario.id_usuario, req.body.goal, req.body.dt_inicio, req.body.dt_fim, req.body.hora_inicio, req.body.hora_fim],
      (error, results, field) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        const response = {
          mensagem: results[0]
        }
        return res.status(200).send(response);
      });
  });
}

exports.adicionarUsuario = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM usuario WHERE nome = ?', [req.body.nome], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Usuário não encontrado!' })
      } else {
        conn.query(
          `call pr_adiciona_usuario_sprint(?,?,?)`,
          [req.usuario.id_usuario, req.body.id_sprint, req.body.nome],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: results[0]
            }
            return res.status(200).send(response);
          })
      }
    });
  });
}

exports.listarSprints = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM sprint', (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Sprints não encontradas!' })
      } else {
        conn.query(
          `SELECT * FROM sprint`,
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
              sprint: results.map(sprint => {
                return {
                  id_sprint: sprint.id_sprint,
                  id_usuario: sprint.id_usuario,
                  goal: sprint.goal,
                  dt_inicio: sprint.dt_inicio,
                  dt_fim: sprint.dt_fim,
                  hora_inicio: sprint.hora_inicio,
                  hora_fim: sprint.hora_fim
                }
              })}
            return res.status(200).send(response);
          })
      }
    });
  });
}

exports.listarMinhasSprints = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM sprint WHERE id_usuario = ?', [req.usuario.id_usuario], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Você não tem Sprints cadastradas!' })
      } else {
        conn.query(
          `call bd_diet.pr_lista_sprint(?)`,
          [req.usuario.id_usuario],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                sprints: results[0]
            }
            return res.status(200).send(response);
          })
      }
    });
  });
}

exports.selecionarSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`SELECT * FROM sprint where id_sprint = ?`,
      [req.body.id_sprint],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length <= 0) {
          return res.status(404).send({
            mensagem: 'Sprint não encontrada!'
          })
        }
        const response = {
          sprint: result[0]
        }
        return res.status(200).send(response);
      });
  });
}

exports.excluiSprint = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query('SELECT * FROM sprint WHERE id_sprint = ?', [req.body.id_sprint], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Sprint não encontrada!' })
      } else {
        conn.query(
          `DELETE FROM sprint WHERE id_sprint = ?`,
          [req.body.id_sprint],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: 'Sprint excluída com sucesso!'
            }
            return res.status(200).send(response);
          })
      }
    });
  });
}

exports.entrarSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
        conn.query(
          `call pr_entra_sprint(?,?)`,
          [req.usuario.id_usuario, req.body.id_sprint],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: results[0]
            }
            return res.status(200).send(response);
          })
    });
};

//listar participantes da sprint (tela 3)
exports.listarParticipantes = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`call pr_lista_participantes_sprint(?,?)`,
      [req.usuario.id_usuario, req.body.id_sprint],
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        if (result.length <= 0) {
          return res.status(404).send({
            mensagem: 'Sprint não encontrada!'
          })
        }
        const response = {
          sprint: result[0]
        }
        return res.status(200).send(response);
      });
  });
}

//cadastrar refeições de participantes da sprint (tela 4)
exports.cadastrarRefeicaoSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
        conn.query(
          `call pr_cria_refeicao_membro_sprint(?,?,?,?,?,?)`,
          [req.body.nm_refeicao, req.body.id_alimentos, req.usuario.id_usuario, req.body.id_sprint, req.body.dt_refeicao, req.body.hr_refeicao],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                mensagem: results[0]
            }
            return res.status(200).send(response);
          })
    });
};

//listar refeições de participantes da sprint (tela 5)
exports.listarRefeicaoParticipanteSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
        conn.query(
          `call pr_lista_refeicao_participantes_sprint(?,?,?)`,
          [req.usuario.id_usuario, req.body.id_usuarioParticipante, req.body.id_sprint],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                refeicoes: results[0]
            }
            return res.status(200).send(response);
          })
    });
};

//selecionar refeição de participantes da sprint (tela 6)
exports.selecionarRefeicaoParticipanteSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
        conn.query(
          `call pr_seleciona_refeicao_participantes_sprint(?,?,?,?)`,
          [req.usuario.id_usuario, req.body.id_usuarioParticipante, req.body.id_sprint, req.body.id_refeicao],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                refeicao: results[0]
            }
            return res.status(200).send(response);
          })
    });
};

//selecionar alimentos da refeição do participante da sprint (tela 7)
exports.listarAlimentoRefeicaoParticipanteSprint = (req, res, next) => {
  console.log(req.usuario)
  mysql.getConnection((err, conn) => {
    if (err) { return res.status(500).send({ error: error }) }
    conn.query(`
            SELECT sp.* FROM sprint sp
            join refeicao_membro_sprint rms on rms.id_sprint = sp.id_sprint
            WHERE sp.id_sprint = ?`, [req.body.id_sprint], (error, results) => {
      if (error) { return res.status(500).send({ error: error }) }
      if (results.length <= 0) {
        res.status(404).send({ mensagem: 'Sprint não encontrada!' })
      } else {
        conn.query(
          `call pr_lista_alimentos_refeicao_participante_sprint(88, 88, 39, 8)`,
          [req.usuario.id_usuario, req.body.id_usuarioParticipante, req.body.id_sprint, req.body.id_refeicao],
          (error, results, field) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            const response = {
                sprints: results[0]
            }
            return res.status(200).send(response);
          })
      }
    });
  });
}
