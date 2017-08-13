var http     = require('http'),
    express = require("express"),
    mysql = require("mysql"),
    bodyParser   = require("body-parser"),
    rest = require("./rest.js");

var app =  express();

var log = function(msg) {
  console.log(msg);
}

function startServer() {
  app.listen(3000, function() {
    log("server started at port 3000.");
  });
}

function setupExpress(connection) {
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({
    extended: true
  })); // for parsing application/x-www-form-urlencoded
  var router = express.Router();
  app.use('/api', router);
  var restRouter = new rest(router, connection);
  log("expressjs has been configured");
  startServer();
}

function connectToMysql() {
  var pool = mysql.createPool({
    connectionLimit : 100,
    host            : "localhost",
    user            : "root",
    password        : "ansh21",
    database        : "todoapp_dockabl",
    debug           : false
  });

  pool.getConnection(function(err, connection) {
    if(err) {
      log("unable to get connection from mysql connection pool. err : " + err);
      process.exit(1);
    } else {
      setupExpress(connection);
    }
  });
}

connectToMysql();

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Hitesh@1',
//   database : 'todoapp_dockabl'
// });
// try {
// 	connection.connect();
//
// } catch(e) {
// 	console.log('Database Connection failed:' + e);
// }

// var fun2 = function() {
//   log("test log fun2");
// }
//
// var fun1 = function() {
//   log("test log fun1");
//   fun2();
// }
//
// fun1();
