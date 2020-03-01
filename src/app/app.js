var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const cors = require('cors')

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://developer:ykGFKuEDrKwOEn2D@bddiet-aa1pr.mongodb.net/bd_app-diet?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Server ON")
}).catch((err) => {
    console.log(err)
})

var app = express();

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const verifyAccessToken = require('./routes/middleware/verifiAccessTokenMiddleware')

app.use('/users', usersRouter);
app.use('/', verifyAccessToken, indexRouter);

module.exports = app;
