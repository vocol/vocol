var express = require('express');
var bodyParser = require('body-parser');
var shell = require('shelljs');
var exec = require('child_process').exec;
var router = express.Router();
var fs = require('fs');
var app = express();

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

router.post('/', function(req, res) {

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  var con = Object.keys(req.body);

  var inputContent = "";
  for (var i in con) {
    inputContent += " " + con[i];
  }
  var validationTool = "rapperChecked";
  var formatting = "formattingChecked";

  var dateTime = Number(new Date());
  var inputFileName = dateTime + '_input.ttl';
  var outputFileName = dateTime + '_output.ttl';

  var inputArray = inputContent.split('StringToSplit');

  fs.writeFile(inputFileName, inputArray[1], function(err) {
    var response = "";
    if (err) {
      contents = err;
    } else {

      var validationOutput = "";
      var validationCommand = "";

      if (validationTool === "rapperChecked") {
        validationCommand = 'rapper -i turtle ' + inputFileName;
      } else if (validationTool === "jenaRiotChecked") {
        validationCommand = 'java -jar ../tools/JenaSyntaxValidator/JenaSyntaxValidator.jar ' +
          inputFileName;
      }

      var child = exec(validationCommand,
        function(err, stdout, stderr) {
         try {
          if (err) {
            response = stderr.replaceAll(inputFileName, inputArray[0]);
            if(validationTool === "rapperChecked"){
              var linkToBeReplaced = 'file:///home/vagrant/VoCol/';
              response = response.replaceAll(linkToBeReplaced, '');
	    }
          } else {
            validationOutput = stdout;
            if (validationOutput.includes("Error")) {
               response = validationOutput.replace(inputFileName, inputArray[0]);
            } else {
              if (formatting === "formattingChecked") {
                shell.exec(
                  'java -cp ../tools/rdf-toolkit.jar org.edmcouncil.rdf_toolkit.SesameRdfFormatter --source ' +
                  inputFileName +
                  ' --source-format turtle --target  ' +
                  outputFileName + ' --target-format turtle'
                ).stdout;

                response = fs.readFileSync(outputFileName, 'utf8');
                fs.unlink(outputFileName);
              }
            }
          }
         }
	 catch (e) {
           response = "Error" + e;
         }

         if(response === "" && formatting === "formattingChecked"){
           response = "Undefined error. Contact the administrator!"
	 }
         else if(formatting !== "formattingChecked"){
	   response +="Syntax Validation";
	 }

         fs.unlink(inputFileName);
         res.send("hallo"+response);

        });
    }
  });

});

module.exports = router;
