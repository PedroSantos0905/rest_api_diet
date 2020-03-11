
const mysql = require('mysql');

var pool = mysql.createPool({
    "user" : "scrumdiet",
    "password": "diet0509@",
    "database" : "bd_diet",
    "host": "bd-diet.mysql.uhserver.com",
});

exports.pool = pool;