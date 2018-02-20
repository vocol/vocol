var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsonfile = require('jsonfile');
var session = require('express-session');

//  GET home page.
router.get('/', function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login'
    });
  else {
    // check if the userConfigurations file is exist
    // for the first time of app running
    var path = "jsonDataFiles/userConfigurations.json";
    fs.exists(path, function(exists) {
      var data = fs.readFileSync(path);
      if (exists && data.includes('vocabularyName')) {
        jsonfile.readFile(path, function(err, obj)  {
          if (err)
            console.log(err); 
          if (obj.hasOwnProperty('text'))
            res.render('index', {
              title: 'Home',
              homePage: obj.text
            });
        });
      }
    });
  }
});

module.exports = router;
