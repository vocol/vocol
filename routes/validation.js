var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
var jsonfile = require('jsonfile');

router.get('/', function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login'
    });
  else {
    var isExistSyntaxError = false;
    var hasPreviousValidOntology = false;
    var errors = [];
    var ErrorsFilePath = 'jsonDataFiles/syntaxErrors.json';
    if (fs.existsSync(ErrorsFilePath)) {
      var content = fs.readFileSync(ErrorsFilePath).toString();
      if (content.includes('errMessege')) {
        isExistSyntaxError = true;
        errors = content;
        console.log("errors:" + errors);
      }
    }
    previousValidOntologyFilePath = 'jsonDataFiles/RDFSConcepts.json'
    if (fs.existsSync(previousValidOntologyFilePath)) {
      hasPreviousValidOntology = true;
    }

    res.render('validation', {
      title: 'Validation',
      syntaxErrors: errors,
      isExistSyntaxError: isExistSyntaxError,
      hasPreviousValidOntology: hasPreviousValidOntology
    });
  }
});

module.exports = router;
