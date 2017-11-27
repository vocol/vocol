var express = require('express');
var router = express.Router();
var fs = require('fs');
var shell = require('shelljs');
var jsonfile = require('jsonfile');


//  GET home page.
router.get('/', function(req, res) {

  var isExistSyntaxError = false;
  var hasPreviousValidOntology = false;
  var errors;
  console.log(process.cwd());
  var ErrorsFilePath = 'jsonDataFiles/syntaxErrors.json';
  if (fs.existsSync(ErrorsFilePath)) {
    console.log('Found file');
    //errors = require(__dirname+ErrorsFilePath);
    var errors = fs.readFileSync(ErrorsFilePath).toString();

    isExistSyntaxError = true;
    console.log("errors:" + errors);
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
});

module.exports = router;
