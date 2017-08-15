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
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });

  app.get("/", function(req, res) {
    res.json({"text": "slash has been hit"})
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
    host            : "35.188.164.126",
    user            : "root",
    password        : "anshul1234",
    database        : "todoapp_dockabl",
    debug           : false
  });

  pool.getConnection(function(err, connection) {
    if(err) {
      log("unable to get connection from mysql connection pool. err : " + err);
      process.exit(1);
    } else {
      log("connected to cloudSQL.")
      setupExpress(connection);
    }
  });
}

connectToMysql();

// https://8080-dot-3002483-dot-devshell.appspot.com/
//
// var server = http.createServer(function(req, res) {
//   console.log("a user hits ther server username : " + req.param.length);
//   res.writeHead(200, {"Content-Type": "application/json"});
//   res.end(JSON.stringify({"text": "Hello world from Hitman"}));
// });
// const PORT = 3000;
// server.listen(PORT, function() {
//   console.log("App listening on port : " + PORT);
//   console.log("Press Ctrl + C to stop server");
// });