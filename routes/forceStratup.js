var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var jsonfile = require('jsonfile');
var shell = require('shelljs');
var router = express.Router();
var spawn = require('child_process').spawn;

shell.exec('echo "{}" > ../vocol/jsonDataFiles/syntaxErrors.json').stdout;

// check if the userConfigurations file is exist
// for the first time of app running
var path = "../vocol/jsonDataFiles/userConfigurations.json";
fs.exists(path, function(exists) {
  if (exists) {
    jsonfile.readFile(path, function(err, obj) {
      if (err)
        console.log(err);

      var pass = true;
      // result of searched file of .ttl
      var k = 1;
      var errors = [];
      // delete oldData if something is there
      shell.mkdir('../vocol/helper/tools/serializations');
      shell.exec(
        'rm -f   ../vocol/helper/tools/serializations/SingleVoc.nt', {
          silent: false
        }).stdout;
      shell.exec(
        'rm -f   ../vocol/helper/tools/ttl2ntConverter/Output.report', {
          silent: false
        }).stdout;
      shell.exec(
        'rm -f   ../vocol/helper/tools/RDFDoctor/*.error', {
          silent: false
        }).stdout;
      shell.exec(
        'rm -f   ../vocol/helper/tools/RDFDoctor/*.output', {
          silent: false
        }).stdout;
      shell.cd('../vocol/helper/tools/ttl2ntConverter/').stdout;
      // converting file from turtle to ntriples format
      var disableConsistenyChecking = true;
      if (obj.hasOwnProperty("consistenyChecking")) {
        disableConsistenyChecking = (obj.consistenyChecking == "true") ?
          true : false;
      }

      shell.exec(
        'java -jar ttl2ntConverter.jar ../../../../repoFolder/ ../serializations/SingleVoc.nt ' +
        disableConsistenyChecking, {
          silent: false
        });

      var pass = function() {
        var outputReport = fs.readFileSync('Output.report');
        var jsonContent = JSON.parse(outputReport);
        for (var i = 0, l = jsonContent.length; i < l; i++) {
          var errorType = "";
          if (jsonContent[i].source == "JenaRiot") {
            pass = false;
            errorType = "Syntax";
          } else {
            errorType = "Inconsistency";
          }
          var errorObject = {
            id: k.toString(),
            file: jsonContent[i].fileName,
            errType: errorType,
            errMessege: jsonContent[i].Message,
            errSource: jsonContent[i].source,
            pusher: "",
            date: new Date().toISOString().slice(0, 10)
          };
          errors.push(errorObject)
          k++;
        }
      }
      pass();
      shell.cd('../RDFDoctor/').stdout;
      var fileData = shell.exec(
        'find ../../../../repoFolder/ -type f -name "*.ttl"', {
          silent: false
        });
      // result of searched file of .ttl
      var filesnamesArray = fileData.split(/[\n]/);
      filesnamesArray.pop();
      for (var i = 0; i < filesnamesArray.length - 1; i++) {
        shell.exec(
          'java -jar RDFDoctor.jar -j -i ' + filesnamesArray[i], {
            silent: false
          });
      }
      var errorFileData = shell.exec(
        'find  -type f -name "*.error"', {
          silent: false
        });
      var errorFilesnamesArray = errorFileData.split(/[\n]/);
      errorFilesnamesArray.pop();

      for (var i = 0; i < errorFilesnamesArray.length; i++) {
        var errReport = fs.readFileSync(errorFilesnamesArray[i]);
        var errJSONContent = JSON.parse(errReport);
        for (var j = 0, l = errJSONContent.length; j < l; j++) {
          var errorObject = {
            id: k.toString(),
            file: errorFilesnamesArray[i].split("/")[1].split(".")[0] +
              ".ttl",
            errType: "Syntax",
            errMessege: errJSONContent[j].errorMessage,
            errSource: "RDF-Doctor",
            pusher: "",
            date: new Date().toISOString().slice(0, 10)
          };
          errors.push(errorObject)
          k++;
        }
      }

      shell.cd('../../../../repoFolder/').stdout;
      // display syntax errors
      if (!pass) {
        if (errors) {
          // display syntax errors
          shell.cd('../vocol/jsonDataFiles/').stdout;
          var pathErrorFile = shell.exec('pwd').stdout;
          shell.cd('../.').stdout;
          var filePath = pathErrorFile.trim() + '/' +
            'syntaxErrors.json';
          shell.exec('pwd').stdout;
          jsonfile.writeFile(filePath, errors, {
            spaces: 2,
            EOL: '\r\n'
          }, function(err) {
            if (err)
              throw err;
            console.log("Errors file is generated\n");
          })
        }
      } else {
        // delete previous data if there is any
        shell.exec('rm -f ../vocol/views/webvowl/data/SingleVoc.json').stdout;
        shell.exec('rm -f ../vocol/jsonDataFiles/RDFSConcepts.json').stdout;
        shell.exec('rm -f ../vocol/jsonDataFiles/SKOSConcepts.json').stdout;
        shell.exec('rm -f ../vocol/jsonDataFiles/SKOSObjects.json').stdout;
        shell.exec('rm -f ../vocol/jsonDataFiles/RDFSObjects.json').stdout;
        shell.exec('rm -f ../vocol/jsonDataFiles/OWLIndividuals.json').stdout;
        shell.exec(
          'rm -f ../vocol/helper/tools/ttl2ntConverter/temp.nt').stdout;
        // Kill fuseki if it is running
        shell.cd('-P', '../vocol/helper/tools/apache-jena-fuseki');
        shell.exec('fuser -k ' + process.argv.slice(2)[1] || 3030 +
          '/tcp', {
            silent: false
          }).stdout;
        shell.exec('rm run/system/tdb.lock', {
          silent: false
        }).stdout;
        // show the cuurent path
        shell.exec('pwd');
        //////////////////////////////
        // update queries in fuseki //
        /////////////////////////////
        // update fuseki queries file with some user-defined queries if there is any
        var fusekiQueriesFilePath = 'webapp/js/app/qonsole-config.js';
        // read contents of the file with the filePathgetTree
        var fusekiQuerieFileContent = fs.readFileSync(
          fusekiQueriesFilePath, 'utf8');
        var queriesContents = fusekiQuerieFileContent.split("queries:")[
          1];
        var queriesContentsInLines = queriesContents.split(/[\n]/);
        if (queriesContentsInLines.length > 0)
          queriesContentsInLines.pop();
        var queryNames = [];
        for (line in queriesContentsInLines) {
          if (queriesContentsInLines[line].includes("\"name\"")) {
            var queryname = queriesContentsInLines[line].split(
              "name\":")[1].split(
              ',')[0].replace(/^"|"$/g, '');
            queryNames.push(queryname.trim().substring(1));
          }
        }
        var index = queriesContents.lastIndexOf(']');
        var data = shell.exec(
          'find ../../../../repoFolder/ -type f -name "*.rq"', {
            silent: false
          });
        var files = data.split(/[\n]/);
        // remove last element, it is empty
        if (files.length > 0)
          files.pop();
        // start the content of fusekiQueries with the following:
        //queriesContents = 'queries:' + queriesContents.substring(0, index);
        var addedQueriesContents = "";

        // loop for all the files with the extension of ".rq"
        for (key in files) {
          var fileName = files[key].substring(2).split(".rq")[0];
          if (fileName.includes('/')) {
            var slachLocation = fileName.lastIndexOf('/');
            fileName = fileName.substring(slachLocation + 1, fileName.length);
          }
          if (queryNames.indexOf(fileName) == -1) {
            var currentQueryFileContent = fs.readFileSync(files[key],
              'utf8');
            addedQueriesContents += ', { "name":"' + fileName + '",\n';
            addedQueriesContents += '"query" :' + JSON.stringify(
                currentQueryFileContent) + '\n}\n';
          }
        }
        // end the content of fusekiQueries with the following:
        addedQueriesContents += "]\n};\n});";
        var upperFusekiQueriesFileContent = 'define( [], function() {\n' +
          'return {\n' +
          'prefixes: {\n' +
          '"rdf":      "http://www.w3.org/1999/02/22-rdf-syntax-ns#",\n' +
          '"rdfs":     "http://www.w3.org/2000/01/rdf-schema#",\n' +
          '"owl":      "http://www.w3.org/2002/07/owl#",\n' +
          '"xsd":      "http://www.w3.org/2001/XMLSchema#"\n' +
          '},\n' +
          'queries: [\n' +
          '      { "name": "Selection of triples",\n' +
          '        "query": "SELECT ?subject ?predicate ?object"+\n' +
          '"WHERE {"+\n' +
          '                 "  ?subject ?predicate ?object}"+\n ' +
          '                 "LIMIT 25"\n' +
          '      },\n' +
          '      { "name": "Selection of classes",\n' +
          '        "query": "SELECT DISTINCT ?class ?label ?description"+\n' +
          '"WHERE {"+\n' +
          '                 "  ?class a owl:Class."+\n' +
          '                 "  OPTIONAL { ?class rdfs:label ?label}"+\n' +
          '                 "  OPTIONAL { ?class rdfs:comment ?description}}"+\n' +
          '                 "LIMIT 25",\n' +
          '        "prefixes": ["owl", "rdfs"]\n' +
          '      }\n';

        // combine the upper upperFusekiQueriesFileContent with the new queries if there is any
        fs.writeFileSync(fusekiQueriesFilePath,
          upperFusekiQueriesFileContent +
          addedQueriesContents);

        // generation the Json files
        shell.cd("../JenaJsonFilesGenrator/").stdout;
        shell.exec('java -jar JenaJsonFilesGenerator.jar').stdout;
        shell.exec('pwd');

        // display visualization part if the user selected it from the configuration page
        shell.exec('pwd');
        shell.cd('../owl2vowl/').stdout;
        shell.exec(
          'java -jar owl2vowl.jar -file ../serializations/SingleVoc.nt', {
            silent: false
          }).stdout;
        shell.mv('SingleVoc.json', '../../../views/webvowl/data/').stdout;

        // run external bash script to start up both fuseki-server and vocol
        const child = spawn('sh', ['../../scripts/run.sh', '&']);
        // show output live of process on std
        child.stdout.pipe(process.stdout);
        shell.exec('pwd');
        shell.cd('../../../.').stdout;
      }
    });
  }
});
