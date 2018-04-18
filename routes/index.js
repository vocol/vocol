var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsonfile = require('jsonfile');
var session = require('express-session');
var request = require('request');

//  GET home page.
router.get('/', function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login'
    });
  else {

    var acceptHeader = req.headers['accept'];
    // return all turtle code inside fuseki endpoint if content-type is turtle
    if (acceptHeader === 'text/turtle' ||
      acceptHeader === 'text/ntriples' ||
      acceptHeader === 'application/rdf+xml' ||
      acceptHeader === 'application/ld+json') {
      var queryObject = 'CONSTRUCT{?s ?p ?o .}WHERE {?s ?p ?o .}';
      var endpoint = "http:\/\/localhost:3030/dataset/sparql?query="
      request({
        url: endpoint + queryObject,
        headers: {'accept': acceptHeader},
      }, function(error, response, body) {
        if (error) {
          console.log('error:', error); // Print the error if one occurred
        } else if (response && body) {
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          if (body) {
            res.write("RDF code in "+ acceptHeader+":\n");
            res.write("========================================================\n");
            res.write(body);
            res.end();
          } else {
            res.send("No data is found ");
          }
        }
      })
  } else {
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
}
});

module.exports = router;
