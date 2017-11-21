var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
var jsonfile = require('jsonfile');


//  GET home page.
router.get('/', function(req, res) {

  var isExistSyntaxError = false;
  var hasPreviousValidOntology = false;
  var ErrorsFilePath = 'jsonDataFiles/syntaxErrors.json';
  var errors = fs.readFileSync(ErrorsFilePath);
  if (errors.toString().includes('Error')) {
    isExistSyntaxError = true;
  }
  previousValidOntologyFilePath = 'jsonDataFiles/RDFSConcepts.json'
   fs.exists(previousValidOntologyFilePath, function(exists) {
    if (exists){
      hasPreviousValidOntology = true;
    }
  });
  res.render('validation', {
    title: 'Syntax Validation',
    syntaxErrors: errors,
    isExistSyntaxError: isExistSyntaxError,
    hasPreviousValidOntology:hasPreviousValidOntology
  });
});

module.exports = router;
