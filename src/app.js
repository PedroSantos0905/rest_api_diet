require("dotenv").config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaUsuarios = require('./routes/usuarios');
const rotaAgua = require('./routes/agua');
const rotaSprint = require('./routes/sprint');
const rotaUserStory = require('./routes/user-story');
const rotaDataAtual = require('./routes/data-atual');
const rotaPerfil = require('./routes/perfil');
const rotaScrumMaster = require('./routes/scrum-master');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Content-Type',
        'Origin',
        'X-Requested-With',
        'Accept',
        'Authorization'
    );

    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();
});

app.use('/usuarios', rotaUsuarios);
app.use('/agua', rotaAgua);
app.use('/sprint', rotaSprint);
app.use('/userStory', rotaUserStory);
app.use('/dataAtual', rotaDataAtual);
app.use('/perfil', rotaPerfil);
app.use('/scrumMaster', rotaScrumMaster);

app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            msg: error.message
        }
    });
});

app.use((req, res, next) => {
    res.status(200).send({
        msg: 'SERVER ON'
    });
});

module.exports = app;
