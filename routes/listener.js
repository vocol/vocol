var express = require('express');
var bodyParser = require('body-parser');
var shell = require('shelljs');
var exec = require('child_process').exec;
var router = express.Router();
var fs = require('fs');
var app = express();
var jsonfile = require('jsonfile');
var http = require('http');
var path = require('path');
var spawn = require('child_process').spawn;

router.post('/', function(req, res) {
  var path = "jsonDataFiles/userConfigurations.json";
  fs.exists(path, function(exists) {
    if (exists) {
      jsonfile.readFile(path, function(err, obj) {
        if (err)
          console.log(err);
        var repositoryService = obj.repositoryService;
        var repositoryNameParam = obj.repositoryName;
        var branchNameParam = obj.branchName;
        //TODO: which value goes here
        var otherBranchesParam = '#otherBranchesParam';

        try {

          var repositoryName = "";
          var branchName = "";
          var commitMessage = "";
          var commitTimestamp = "";
          var pusher = "";

          if (repositoryService === 'gitHub') {
            var data = JSON.parse(JSON.stringify(req.body));
            repositoryName = data.repository.name;
            branchName = data.ref.split('/')[2];
            commitMessage = data.head_commit.message;
            commitTimestamp = data.head_commit.timestamp;
            pusher = data.pusher.name;

          } else if (repositoryService === 'gitLab') {
            var data = JSON.parse(JSON.stringify(req.body));
            repositoryName = data.repository.name;
            branchName = data.ref.split('/')[2];
            commitMessage = data.commits[0].message;
            commitTimestamp = data.commits[0].timestamp;
            pusher = data.user_username;

          } else if (repositoryService === 'bitBucket') {
            var data = JSON.parse(req.body.payload);
            repositoryName = data.repository.links.html.href;
            branchName = data.push.changes[0].old.name;
            commitMessage = data.push.changes[0].new.target.message;
          } else {
            var data = JSON.parse(JSON.stringify(req.body));
            repositoryName = "https:\/\/ahemid@jira.iais.fraunhofer.de/stash/scm/~lhalilaj/vwsandbox.git";
            repositoryName = repositoryNameParam;
            branchName = data.refChanges[0].refId.split('/')[2];
            commitMessage = data.changesets.values[0].toCommit.message;
            pusher = data.changesets.values[0].toCommit.committer.name;
            var commitTimeInMilliseconds = data.changesets.values[0]
              .toCommit.authorTimestamp;
            var event = new Date(commitTimeInMilliseconds);
            commitTimestamp = event.toJSON();
            console.log("data are " + branchName + " " +
              commitMessage + " " + pusher + "timestap" +
              commitTimeInMilliseconds + " " + commitTimestamp);
          }

          if (branchName == branchNameParam && repositoryNameParam ===
            repositoryName && !commitMessage.includes("merge")) {
            console.log('contains');

            commitMessage = commitMessage.replace(/\n/g, '');

            shell.exec('pwd', {
              silent: false
            }).stdout;


            shell.cd('../repoFolder', {
              silent: false
            }).stdout;
            shell.exec('git checkout ' + obj.branchName, {
              silent: false
            }).stdout;
            shell.exec('git reset --hard', {
              silent: false
            }).stdout;
            shell.exec('git pull', {
              silent: false
            }).stdout;
            shell.exec(
              'echo "[]" > ../vocol/jsonDataFiles/syntaxErrors.json'
            ).stdout;



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
                'rm -f   ../vocol/helper/tools/ttl2ntConverter/logging.log', {
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
              disableConsistenyChecking = (obj.consistenyChecking ==
              "true") ?
                true : false;
            }

            shell.exec(
              'java -jar ttl2ntConverter.jar ../../../../repoFolder/ ../serializations/SingleVoc.nt ' +
              disableConsistenyChecking, {
                silent: false
              });

            var pass = function() {
              if (fs.existsSync('Output.report')) {
                var outputReport = fs.readFileSync(
                  'Output.report');
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
                    pusher: pusher,
                    date: commitTimestamp.split("T")[0] | new Date()
                        .toISOString().slice(0, 10)
                  };
                  errors.push(errorObject)
                  k++;
                }
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
                'java -jar RDFDoctor.jar -j -i ' +
                filesnamesArray[i], {
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
              var errReport = fs.readFileSync(errorFilesnamesArray[
                i]);
              var errJSONContent = JSON.parse(errReport);
              for (var j = 0, l = errJSONContent.length; j < l; j++) {
                var errorObject = {
                  id: k.toString(),
                  file: errorFilesnamesArray[i].split("/")[1].split(
                      ".")[0] +
                    ".ttl",
                  errType: "Syntax",
                  errMessege: errJSONContent[j].errorMessage,
                  errSource: "RDF-Doctor",
                  pusher: pusher,
                  date: commitTimestamp.split("T")[0] | new Date()
                      .toISOString().slice(0, 10)
                };
                errors.push(errorObject)
                k++;
              }
            }

            shell.cd('../../../../repoFolder/').stdout;
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
              shell.exec('pwd');
              res.redirect('./validation');
            } else // continue the process
            {
              // delete previous data if there is any
              shell.exec(
                'rm -f ../vocol/views/webvowl/data/SingleVoc.json'
              ).stdout;
              shell.exec(
                'rm -f ../vocol/jsonDataFiles/RDFSConcepts.json')
                .stdout;
              shell.exec(
                'rm -f ../vocol/jsonDataFiles/SKOSConcepts.json')
                .stdout;
              shell.exec(
                'rm -f ../vocol/jsonDataFiles/SKOSObjects.json').stdout;
              shell.exec(
                'rm -f ../vocol/jsonDataFiles/RDFSObjects.json').stdout;
              shell.exec(
                'rm -f ../vocol/jsonDataFiles/OWLIndividuals.json'
              ).stdout;
              shell.exec(
                'rm -f ../vocol/helper/tools/ttl2ntConverter/temp.nt'
              ).stdout;
              // Kill fuseki if it is running
              shell.cd('-P',
                '../vocol/helper/tools/apache-jena-fuseki');
              shell.exec('fuser -k ' + process.argv.slice(2)[1] ||
                3030 + '/tcp', {
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
              var queriesContents = fusekiQuerieFileContent.split(
                "queries:")[1];
              var index = queriesContents.lastIndexOf(']');
              var data = shell.exec(
                'find ../../../../repoFolder/ -type f -name "*.rq"', {
                  silent: false
                });
              var files = data.split(/[\n]/);
              // remove last element, it is empty
              files.pop();
              // start the content of fusekiQueries with the following:
              queriesContents = 'queries:' + queriesContents.substring(
                0, index);
              // loop for all the files with the extension of ".rq"
              for (key in files) {
                var fileName = files[key].substring(2).split(".rq")[
                  0];
                if (fileName.includes('/')) {
                  var slachLocation = fileName.lastIndexOf('/');
                  fileName = fileName.substring(slachLocation + 1,
                    fileName.length);
                }
                if (!fusekiQuerieFileContent.split("queries:")[1].includes(
                    fileName)) {
                  var currentQueryFileContent = fs.readFileSync(
                    files[key], 'utf8');
                  queriesContents += ', { "name" :"' + fileName +
                    '",\n';
                  queriesContents += '"query" :' + JSON.stringify(
                      currentQueryFileContent) + '\n}\n';
                }
              }
              // end the content of fusekiQueries with the following:
              queriesContents += "]\n};\n});";
              var upperFusekiQueriesFileContent = 'define( [], function() {\n' +
                'return {\n' +
                'prefixes: {\n' +
                '"rdf":      "http://www.w3.org/1999/02/22-rdf-syntax-ns#",\n' +
                '"rdfs":     "http://www.w3.org/2000/01/rdf-schema#",\n' +
                '"owl":      "http://www.w3.org/2002/07/owl#",\n' +
                '"xsd":      "http://www.w3.org/2001/XMLSchema#"\n' +
                '},\n';
              console.log(upperFusekiQueriesFileContent +
                queriesContents);
              // combine the upper upperFusekiQueriesFileContent with the new queries if there is any
              fs.writeFileSync(fusekiQueriesFilePath,
                upperFusekiQueriesFileContent + queriesContents)

              // generation the Json files
              shell.cd("../JenaJsonFilesGenrator/").stdout;
              shell.exec('java -jar JenaJsonFilesGenerator.jar').stdout;
              shell.exec('pwd');

              // display visualization part if the user selected it from the configuration page
              if (obj.visualization === "true") {
                shell.exec('pwd');
                shell.cd('../owl2vowl/').stdout;
                shell.exec(
                  'java -jar owl2vowl.jar -file ../serializations/SingleVoc.nt', {
                    silent: false
                  }).stdout;
                shell.mv('SingleVoc.json',
                  '../../../views/webvowl/data/').stdout;
              }

              if (obj.turtleEditor === "true" && obj.repositoryService ===
                "gitHub") {
                shell.exec('pwd', {
                  silent: false
                }).stdout;
                // filePath where we read from
                var filePath = '../../../views/editor/js/turtle-editor.js';
                // read contents of the file with the filePath
                var contents = fs.readFileSync(filePath, 'utf8');
                contents = contents.replace(
                  /(owner\.val\(")(.*?)"/mg, "owner.val(\"" + obj
                    .repositoryOwner + "\"");
                contents = contents.replace(
                  /(repo\.val\(")(.*?)"/mg, "repo.val(\"" + obj.repositoryName +
                  "\"");
                // write back to the file with the filePath
                fs.writeFileSync(filePath, contents);
              }

              if (obj.evolutionReport === "true") {
                // Evolution Part
                if (fs.existsSync('../evolution/SingleVoc.nt')) {
                  shell.cd('../owl2vcs/').stdout;
                  //  shell.mkdir('../evolution');
                  shell.exec('pwd');
                  // add commit details when user make new commit
                  var commitDetails = "";
                  if (commitTimestamp != "")
                    commitDetails = "commitTimestamp:" +
                      commitTimestamp + "\n" + "pusher:" + pusher +
                      "\n" + "commitMessage:" + commitMessage + "\n";
                  var evolutionReport = shell.exec(
                    'java -jar owl2vcs.jar  ../evolution/SingleVoc.nt ../serializations/SingleVoc.nt', {
                      silent: false
                    }).stdout;
                  if (evolutionReport.includes('+') ||
                    evolutionReport.includes('-')) {
                    fs.appendFileSync(
                      '../evolution/evolutionReport.txt',
                      commitDetails + evolutionReport);
                  }
                }
                shell.exec('pwd', {
                  silent: false
                }).stdout;
                shell.mkdir('../evolution').stdout;
                shell.cp('../serializations/SingleVoc.nt',
                  '../evolution/SingleVoc.nt').stdout;
              }

              // run external bash script to start up both fuseki-server and vocol
              const child = spawn('sh', ['../../scripts/run.sh',
                '&'
              ]);
              // show output live of process on std
              child.stdout.pipe(process.stdout);
              shell.exec('pwd');
              shell.cd('../../../.').stdout;

            }
          }
        } catch (e) {
          console.log("error:");
          console.log(e);
        }
      });
    }
  });

});

module.exports = router;
