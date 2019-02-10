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
        jsonfile.readFile(path, function(err, obj)  {
          if (err)
            console.log(err);
          if (obj.loginUserName) {
		console.log(obj.loginUserName);
                console.log(req.body.password);
                console.log(obj.loginPassword);


            bcrypt.compare(req.body.password, obj.loginPassword, function(err, result) {
      if (err) { throw (err); }

              if (result) {
                req.session.isAuthenticated = true;
                req.session.username = obj.loginUserName;
                res.redirect('./');
              } else
                res.render('login', {
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
  res.render('login', {
    title: 'login'
  });
});

module.exports = router;

