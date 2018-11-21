var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var jsonfile = require('jsonfile');
var shell = require('shelljs');
var router = express.Router();
var spawn = require('child_process').spawn;
var path = require('path');

router.get('/', function(req, res) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  // check if the userConfigurations file is exist
  // for the first time of app running
  var path = "jsonDataFiles/userConfigurations.json";
  fs.exists(path, function(exists) {
    if (exists) {
      jsonfile.readFile(path, function(err, obj) {
        if (err)
          console.log(err);

        // get out of the root of the vocol folder
        shell.cd('..');

        var clientHooks = (obj.hasOwnProperty('clientHooks')) ?
          true : false;
        var webHook = (obj.hasOwnProperty('webHook')) ? true :
          false;
        var turtleEditor = (obj.turtleEditor === "true") ? true :
          false;
        var repositoryURL = obj.repositoryURL;
        repositoryURL = repositoryURL.trim();
        if (repositoryURL[repositoryURL.length - 1] === ('/'))
          repositoryURL = repositoryURL.slice(0, -1);

        shell.exec('pwd', {
          silent: false
        }).stdout;
        var path = "./repoFolder";
        if (fs.existsSync(path)) {
          console.log("folder is exist");
          shell.cd("repoFolder");
          var localRepository = shell.exec(
            'git ls-remote --get-url', {
              silent: false
            }).stdout;
          //TODO*:check the correct format to login with username and password
          // check if the localRepository same same entered config
          if (localRepository === obj.repositoryURL ||
            localRepository === 'https://' + obj.user + ':' + obj.password +
            '@' + obj.repositoryURL.slice(8)) {
            console.log('ready to pull');
            shell.exec('git checkout ' + obj.branchName, {
              silent: false
            }).stdout;
            shell.exec('git reset --hard', {
              silent: false
            }).stdout;
            shell.exec('git pull', {
              silent: false
            }).stdout;
          } else {
            shell.cd("..");
            shell.rm("-rf", "repoFolder");
            //TODO*:change  the following login
            if (obj.repositoryType === "private")
              shell.exec('git clone https://"' + obj.user + ":" +
                encodeURIComponent(obj.password) + "@" +
                repositoryURL.slice(8) + '" repoFolder', {
                  silent: false
                }).stdout;
            else
              shell.exec('git clone "' + repositoryURL +
                '" repoFolder', {
                  silent: false
                }).stdout;
            shell.cd("repoFolder");
          }
        } else {
          if (obj.repositoryType === "public") {
            shell.mkdir("repoFolder");
            shell.exec('git clone "' + repositoryURL +
              '" repoFolder', {
                silent: false
              }).stdout;
          }
          // else it was catched at /config as a private
          shell.cd("repoFolder");

        }

        shell.exec('git checkout ' + obj.branchName, {
          silent: false
        }).stdout;
        shell.exec('git reset --hard', {
          silent: false
        }).stdout;
        shell.exec('git pull', {
          silent: false
        }).stdout;

        // check if the user has an error and this was for first time or
        // when user has changed to another repositoryURL
        // currentrepositoryURL === "" means it is the first time
        var currentrepositoryURL = shell.exec(
          'git ls-remote --get-url', {
            silent: false
          }).stdout;
        if (currentrepositoryURL != obj.repositoryURL) {
          // reset the app. if the repositoryURL was changed
          shell.exec(
            'echo "" > ../vocol/helper/tools/evolution/evolutionReport.txt'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/syntaxErrors.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/RDFSConcepts.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/SKOSConcepts.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/SKOSObjects.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/RDFSObjects.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/OWLIndividuals.json'
          ).stdout;
          shell.exec(
            'rm -f ../vocol/helper/tools/serializations/SingleVoc.nt'
          ).stdout;
          shell.exec(
            'rm -f ../vocol/helper/tools/ttl2ntConverter/temp.nt'
          ).stdout;
          shell.exec(
            'rm -f ../vocol/helper/tools/evolution/SingleVoc.nt')
            .stdout;
          shell.exec(
            'rm -f ../vocol/views/webvowl/data/SingleVoc.json').stdout;
          console.log("App's previous data was deleted");
        }
        // everytime remove all pervious errors if some were saved
        shell.exec(
          'echo "[]" > ../vocol/jsonDataFiles/syntaxErrors.json')
          .stdout;

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
                pusher: "",
                date: new Date().toISOString().slice(0,
                  10)
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
              file: errorFilesnamesArray[i].split("/")[1].split(
                  ".")[0] +
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

        if (turtleEditor === true && obj.repositoryService ===
          "gitHub") {
          shell.exec('pwd', {
            silent: false
          }).stdout;
          // filePath where we read from
          var filePath = '../vocol/views/editor/js/turtle-editor.js';
          // read contents of the file with the filePathgetTree
          var contents = fs.readFileSync(filePath, 'utf8');
          contents = contents.replace(/(owner\.val\(")(.*?)"/mg,
            "owner.val(\"" + obj.repositoryOwner + "\"");
          contents = contents.replace(/(repo\.val\(")(.*?)"/mg,
            "repo.val(\"" + obj.repositoryName + "\"");
          contents = contents.replace(/(branch\.val\(")(.*?)"/mg,
            "branch.val(\"" + obj.branchName + "\"");
          contents = contents.replace(/(getTree\(")(.*?)"/mg,
            "getTree(\"" + obj.branchName + "\"");
          // write back to the file with the filePath
          fs.writeFileSync(filePath, contents);
        }

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
        }
        //if no syntax errors, then contiune otherwise stop
        else {
          // delete previous data if there is any
          shell.exec(
            'rm -f ../vocol/views/webvowl/data/SingleVoc.json').stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/RDFSConcepts.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/SKOSConcepts.json'
          ).stdout;
          shell.exec(
            'echo "[]" >../vocol/jsonDataFiles/SKOSObjects.json')
            .stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/RDFSObjects.json'
          ).stdout;
          shell.exec(
            'echo "[]" > ../vocol/jsonDataFiles/OWLIndividuals.json'
          ).stdout;
          shell.exec(
            'rm -f ../vocol/helper/tools/ttl2ntConverter/temp.nt'
          ).stdout;
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
            var fileName = files[key].substring(2).split(".rq")[0];
            if (fileName.includes('/')) {
              var slachLocation = fileName.lastIndexOf('/');
              fileName = fileName.substring(slachLocation + 1,
                fileName.length);
            }
            if (!fusekiQuerieFileContent.split("queries:")[1].includes(
                fileName)) {
              var currentQueryFileContent = fs.readFileSync(files[
                key], 'utf8');
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

          // Evolution Part
          if (obj.evolutionReport === "true") {

            shell.exec('pwd', {
              silent: false
            }).stdout;
            shell.mkdir('../evolution').stdout;
            shell.cp('../serializations/SingleVoc.nt',
              '../evolution/SingleVoc.nt').stdout;
            console.log("SingleVoc.nt is copied to evolution");
          }

          // Update the dataProtection policy and script if infomationProtectionAgreement was selected
          if (obj.dataProtectionAgreement == "true") {
            shell.exec('pwd', {
              silent: false
            }).stdout;
            shell.cd('../../../');
            shell.exec('pwd', {
              silent: false
            }).stdout;
            if (obj.text2) {
              var dataProtectionHtmlPage = '<% include header %><div style="margin-top: 3% !important;"></div><div class="ui grid"><div class="ui container">'
              dataProtectionHtmlPage += obj.text2;
              dataProtectionHtmlPage += '</div></div><% include footer %>';
              fs.writeFileSync("views/dataProtection.ejs",
                dataProtectionHtmlPage, {
                  encoding: 'utf8',
                  flag: 'w'
                });
            }
            if (obj.text3) {
              fs.writeFileSync("views/dataProtectionScript.ejs",
                obj['text3'], {
                  encoding: 'utf8',
                  flag: 'w'
                });
            }
            shell.cd('helper/tools/owl2vowl/');
            shell.exec('pwd', {
              silent: false
            }).stdout;
          }

          //TODO: just disable for testing perpose
          if (obj.clientHooks === "true") {
            shell.exec("pwd"); // in repoFolder path
            console.log('this is client-side services');
            shell.cd('../../../../repoFolder');
            shell.mkdir('VoColClient');
            shell.cp('-r',
              '../vocol/helper/tools/VoColClient/Hooks',
              'VoColClient');
            shell.cd('-P', 'VoColClient/Hooks');
            shell.exec("pwd");
            // replace the  server URL in the client Hooks
            var serverURL = obj.server;
            if (serverURL.charAt(serverURL.length - 1) == '/') {
              serverURL = serverURL.substr(0, serverURL.length - 1);
            }
            var precommitFile = './pre-commit';
            if (fs.existsSync(precommitFile)) {
              var data = fs.readFileSync(precommitFile);
              data = data.toString().replace("serverURL", serverURL);
              fs.writeFileSync(precommitFile, data, 'utf8');
            }
            shell.cd('../..'); //repoFolder
            shell.exec('pwd');
            shell.exec('git add .', {
              silent: false
            }).stdout;
            //TODO: check if "client services" are enabled
            shell.exec(
              'git commit -m "configuration of repository"', {
                silent: false
              }).stdout;
            shell.exec('pwd').stdout;
            shell.cd('../vocol/helper/tools/VoColClient/'); //VoColClient

          }
          // run external bash script to start up both fuseki-server and vocol
          const child = spawn('sh', ['../../scripts/run.sh', '&']);
          // show output live of process on std
          child.stdout.pipe(process.stdout);
          shell.exec('pwd');
          shell.cd('../../../.').stdout;
          // redirect to the start page
          res.redirect('./');
        }
      /*else // if it has syntaxErrors
      {
        shell.exec('pwd');
        shell.cd('../vocol/').stdout;
        res.redirect('./validation');
      }*/
      });
    } else {
      res.redirect('./config');
    }
  });
});

module.exports = router;
