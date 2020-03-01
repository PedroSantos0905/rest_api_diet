var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Users = require('../models/users');

const crypto = require('crypto');
const mailer = require('../../modules/mailer');

router.post('/', async function(req, res, next) {
  try {
    const createUserToken = crypto.randomBytes(20).toString('hex');
    const newUser = new Users({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      createAt: req.body.createAt,
      createUserToken: createUserToken,
      active: true,
    })

    const { email } = req.body;

    mailer.sendMail({
      to: email,
      from: 'pedrosantos0509@gmail.com',
      template: 'auth/create_user',
      context: { createUserToken },
    }, (error) => {
      if (error)
        return res.status(400).send({ error: 'Não foi possível enviar email de cadastro' });
    })

    await newUser.save()

    return res.status(201).json("Cadastro realizado com sucesso");

  } catch (error) {
    return res.status(500).json({
      msg: "Erro no cadastro do usuário",
      error
    })
  }

});

router.post('/authenticate', async function(req, res, next) {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email })
    .select('+active');

    if (!user || !bcrypt.compareSync(req.body.password, user.password)){
      return res.status(400).json({msg: "Usuário não encontrado com os dados informados"})
    }

    if (user.active == false){
      return res.status(400).json({msg: "Seu cadastro encontra - se desativado"})
    }
    
    const token = jwt.sign({
      email: user.email
    }, 'TOP_SECRET')
    
    if(user.active == true){
      return res.status(200).json({
        msg: "Login efetuado com sucesso",
        token,
        username: user.username
      })
    }

  } catch (error) {
    return res.status(500).json({
      msg: "Erro na autenticação",
      error
    })
  }
});

router.post('/forgot_password', async (req, res) =>{
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email });

    if(!user)
    return res.status(400).send({ error: 'Usuário não existe' });

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours()+1);

    await Users.findByIdAndUpdate( user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });

    mailer.sendMail({
      to: email,
      from: 'pedrosantos0509@gmail.com',
      template: 'auth/forgot_password',
      context: { token },
    }, (error) => {
      if (error)
        return res.status(400).send({ error: 'Não foi possível enviar email de reset de senha' });
    })

    return res.status(201).json("Por favor verifique seu email para continuar");

  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Erro por favor, tente novamente' })
  }
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await Users.findOne({ email })
    .select('+passwordResetToken passwordResetExpires');

  if(!user)
    return res.status(400).send({ error: 'Usuário não existe' });

  if (token !== user.passwordResetToken)
    return res.status(400).send({ error: 'Token inválido'});

  const now = new Date();

  if (now > user.passwordResetExpires)
    return res.status(400).send({ error: 'Token expirado, gere um novamente'});

  user.password = bcrypt.hashSync(password, 10)
  await user.save();

  return res.status(201).json("Senha resetada com sucesso");
  } catch (error) {
    res.status(400).send({ error: 'Não foi possível resetar senha tente novamente' });
  }
});

router.post('/verify', async (req, res, next) => {
      const { email, token, active } = req.body;

      try {
      const user = await Users.findOne({ email })
      .select('+createUserToken active');

      if(!user)
      return res.status(400).send({ error: 'Usuário não existe' });
  
      if (token !== user.createUserToken)
      return res.status(400).send({ error: 'Token inválido'});

      user.active = active;
      await user.save();

      return res.status(201).json("Cadastro finalizado com sucesso");
    } catch (error) {
      console.log(error)
      res.status(400).send({ error: 'Não foi possível finalizar o cadastro' });
    }
  });

  router.post('/desative', async (req, res, next) => {
    const { email, token, active } = req.body;

    try {
    const user = await Users.findOne({ email })
    .select('+createUserToken active');

    if(!user)
    return res.status(400).send({ error: 'Usuário não existe' });

    if (token !== user.createUserToken)
    return res.status(400).send({ error: 'Token inválido'});

    user.active = active;
    await user.save();

    return res.status(201).json("Cadastro desativado com sucesso");
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Não foi possível finalizar o cadastro' });
  }
});

module.exports = router;