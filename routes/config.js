var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsonfile = require('jsonfile');
var session = require('express-session');
// this for creating hash for password
var bcrypt = require('bcrypt');
const saltRounds = 10;

// http post when  a user configurations is submitted
router.post('/', function(req, res) {
  // check if the userConfigurations file is exist
  // for the first time of app running
  var filepath = "jsonDataFiles/userConfigurations.json";
  var isAdminPasswordModified = true,
      isPrivateLoginPasswordModified = true;
  jsonfile.readFile(filepath, function(err, obj)  {
    if (err)
      console.log(err);  
    var userData = req.body;
    if (obj.hasOwnProperty("adminPass")){
      if (obj.adminPass === userData.adminPass)
      isAdminPasswordModified = false;
      if (obj.loginPassword === userData.loginPassword)
      isPrivateLoginPasswordModified = false;
    }
      if(isAdminPasswordModified || isPrivateLoginPasswordModified)
        bcrypt.genSalt(saltRounds, function(err, salt) {
          if (isPrivateLoginPasswordModified)
              bcrypt.hash(userData.loginPassword, salt, function(err, hash) {
                // Store hash in your password DB.
                userData.loginPassword = hash;
                jsonfile.writeFile(filepath, userData, {
                  spaces:  2,
                   EOL:   '\r\n'
                },  function(err)  {  
                  if (err)
                    throw err;
                })
              });
          if (isAdminPasswordModified)
              bcrypt.hash(userData.adminPass, salt, function(err, hash) {
                // Store hash in your password DB.
                userData.adminPass = hash;
                jsonfile.writeFile(filepath, userData, {
                  spaces:  2,
                   EOL:   '\r\n'
                },  function(err)  {  
                  if (err)
                    throw err;
                })
              });
        });
  });
  res.render('userConfigurationsUpdated', {
    title: 'Preparation'
  });
});

router.get('/', function(req, res) {
  console.log(req.originalUrl);
  if (!req.originalUrl.includes("true") && req.app.locals.isExistAdminAccount) {
    res.render('adminLogin', {
      title: 'login'
    });
  } else {
    // check if the userConfigurations file is exist
    // for the first time of app running
    var filepath = "jsonDataFiles/userConfigurations.json";
    jsonfile.readFile(filepath, function(err, obj)  {
      if (err)
        throw err;  
      res.render('config', {
        title: 'Configuration Page',
        inputComponentsValues: obj
      });
    });
  }
});

module.exports = router;
