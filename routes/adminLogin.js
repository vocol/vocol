var express = require('express');
var bodyParser = require('body-parser');
var shell = require('shelljs');
var exec = require('child_process').exec;
var router = express.Router();
var fs = require('fs');
var app = express();
var bcrypt = require('bcrypt');
var jsonfile = require('jsonfile');
var session = require('express-session');


router.post('/', function(req, res) {
  var path = "jsonDataFiles/userConfigurations.json";
  fs.exists(path, function(exists) {
    if (exists) {
      var data = fs.readFileSync(path);
      if (data.includes('vocabularyName')) {
        jsonfile.readFile(path, function(err, obj)  {
          if (err)
            console.log(err); 
          // check if user exists then do authentication else redirect back to same login page
          if (obj.adminUserName) {
            bcrypt.compare(req.body.password, obj.adminPass, function(err, result) {
              if (result) {
                res.redirect('./config?valid=true');
              } else
                res.render('adminLogin', {
                  title: 'login'
                });
            });
          }
        });
      }
    }
  });
});


router.get('/', function(req, res) {
  res.render('adminLogin', {
    title: 'login'
  });
});

module.exports = router;
