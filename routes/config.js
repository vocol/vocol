var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsonfile = require('jsonfile');
var session = require('express-session');
var shell = require('shelljs');
var CryptoJS = require("crypto-js");
// this for creating hash for password
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync();
var escapeHtml = require('escape-html');

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
    if (obj)
      if (obj.hasOwnProperty("adminPass")) {
        if (obj.adminPass === userData.adminPass)
          isAdminPasswordModified = false;
        if (obj.loginPassword === userData.loginPassword)
          isPrivateLoginPasswordModified = false;
      }
    if (userData.repositoryType === "private") {
       shell.cd("..");
          shell.exec('pwd', {
          silent: false
        }).stdout;

      var isRepoCloned = shell.exec('git clone https://"' + userData.user + ":" + encodeURIComponent(CryptoJS.AES.decrypt(userData.password.toString(), userData.user).toString(CryptoJS.enc.Utf8)) + "@" + userData.repositoryURL.slice(8) + '" repoFolder', {
        silent: false
      }).stdout;
      if (!isRepoCloned.includes("failed")){
          shell.cd("repoFolder");
	  shell.exec('git config --global credential.helper store', {
          silent: false
        }).stdout;
        shell.cd("../vocol/");
                 shell.exec('pwd', {
          silent: false
        }).stdout;


              if (isAdminPasswordModified || isPrivateLoginPasswordModified) {
               
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
                
                // wait till the configurations is finished
                res.render('userConfigurationsUpdated', {
                  title: 'Preparation'
                });
              }
      }
      else
        res.render('config', {
          data: req.body, // { message, email }
          title: 'Configuration Page',
          inputComponentsValues: userData,
          errors: {
            message: {
              msg: 'Ooops you have select a private repository, but we cannot clone the selected repository using the given credentials.'
            },
            tryAgain: {
              msg: 'Please, try again by entering valid credentials '
            }
          }
        })
    } else {

      if (isAdminPasswordModified || isPrivateLoginPasswordModified) {
       
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
        
        // wait till the configurations is finished
        res.render('userConfigurationsUpdated', {
          title: 'Preparation'
        });
      }
    }
  });
});




router.get('/', function(req, res) {
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
      var userData = {};
      if (obj){
        userData = obj;
        userData.text3 =   escapeHtml(userData.text3);
      }
      res.render('config', {
        title: 'Configuration Page',
        inputComponentsValues: userData,
        data: {},
        errors: {}
      });
    });
  }
});

module.exports = router;

