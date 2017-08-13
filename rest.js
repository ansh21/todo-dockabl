var mysql = require('mysql');

function restRouter(router, connection) {
  console.log("router set in rest.js");
  handleApiRequests(router, connection);
}

function handleApiRequests(router, connection) {
  router.post("/", function(req, res) {
    console.log("handling /");
    res.json({
      "Message" : "param1 : " + req.query.param1
    });
  });

  router.post("/addTask", function(req, res) {
    console.log("handling /addTask req url : " + req.originalUrl
      + ", req body length : " + req.query.length);
    var taskDescription = req.query.text;
    var channelPostedIn = req.query.channel_id;
    var userPostedBy = req.query.user_id;
    var status = "0";

    console.log("taskDescription : " + taskDescription);
    console.log("channelPostedIn : " + channelPostedIn);
    console.log("userPostedBy : " + userPostedBy);

    //first check if task is present in db or not.
    var countQuery = "SELECT * from ?? WHERE ??=? AND ??=?";
    var tableCountQuery = ["tasks", "task_description", taskDescription,
    "channel_posted_in", channelPostedIn];
    countQuery = mysql.format(countQuery, tableCountQuery);
    console.log(countQuery);
    connection.query(countQuery, function(err, result) {
      if(err) {
        res.json({"text" : err});
      } else {
        if(result.length == 0) {
          var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
          var table = ["tasks",
            "task_description", "channel_posted_in", "user_posted_by", "status",
            taskDescription, channelPostedIn, userPostedBy, status];
          query = mysql.format(query, table);
          connection.query(query, function(err, rows) {
            if(err) {
              res.json({"Error" : err});
            } else {
              res.json({
                "response_type": "in_channel",
                "text" : "Task added by user : "+ userPostedBy
                  + " in channel : " + channelPostedIn});
            }
          });
        } else {
          res.json({
            "text" : "Task already added by " + result[0].user_posted_by
          })
        }
      }
    });
  });

  router.post("/getAllTasks", function(req, res) {
    console.log("handling /getAllTasks");
    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["tasks", "status", "0"];
    query = mysql.format(query,table);
    connection.query(query, function(err,rows) {
      if(err) {
        res.json({"text" : err});
      } else {
        res.json({"text" : rows});
      }
    });
  });

  router.post("/taskCompleted", function(req, res) {
    console.log("handling /taskCompleted");
    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var table = ["tasks", "status", "1", "task_description",
      req.query.task_description];
    query = mysql.format(query,table);
    connection.query(query, function(err,rows) {
      if(err) {
        res.json({"text" : err});
      } else {
        res.json({
          "response_type": "in_channel",
          "text" : "task *" + req.query.task_description
            + "* has been completed"});
      }
    });
  });
}

module.exports = restRouter;
