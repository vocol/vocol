var express = require('express');
var bodyParser = require('body-parser');
var shell = require('shelljs');
var exec = require('child_process').exec;
var router = express.Router();
var fs = require('fs');
var app = express();
var  jsonfile  =  require('jsonfile');
var http = require('http');
var path = require('path');
var spawn = require('child_process').spawn;

router.post('/', function(req, res) {
  var path = "jsonDataFiles/userConfigurations.json";
  fs.exists(path, function(exists) {
    if (exists) {
      jsonfile.readFile(path, function(err, obj)  {
        if (err)
          console.log(err); 
        //show what inside the file             //
        // var repository = obj.repository.trim();
        // repository = repository.split(".git");
        // console.log(repository);

        var repositoryService = obj.repositoryService;
        var repositoryNameParam = obj.repositoryName;
        var branchNameParam = obj.branchName;
        //TODO: which value goes here
        var otherBranchesParam = '#otherBranchesParam';
        // var port = 3001;
        //
        // app.set('port', port);
        // //TODO: enable listening to the port
        // var server = http.createServer(app).listen(port, function() {
        //   console.log('WebHookListener running at http://localhost:' + port);
        // });
        // server.on('request', function(req, res) {
        //     req.setEncoding('utf8');
        //     req.on('data', function(chunk) {
        console.log('event received');
        try {
          var data = JSON.parse(req.body.payload);

          console.log(data);

          var repositoryName = "";
          var branchName = "";
          var commitMessage = "";
          var commitTimestamp = "";
          var pusher = "";

          if (repositoryService === 'gitHub') {
            repositoryName = data.repository.name;
            branchName = data.ref.split('/')[2];
            commitMessage = data.head_commit.message;
            commitTimestamp = data.head_commit.timestamp;
            pusher = data.pusher.name;

          } else if (repositoryService === 'gitLab') {
            repositoryName = data.repository.homepage;
            branchName = data.ref;
            commitMessage = data.commits[0].message;
          } else if (repositoryService === 'bitBucket') {
            repositoryName = data.repository.links.html.href;
            branchName = data.push.changes[0].old.name;
            commitMessage = data.push.changes[0].new.target.message;
          } else {
            repositoryName = repositoryNameParam;
            branchName = data.refChanges[0].refId.split('/')[2];
            commitMessage = data.changesets.values[0].toCommit.message;
          }

          if (branchName == branchNameParam && repositoryNameParam === repositoryName && !commitMessage.includes("merge")) {
            console.log('contains');

            commitMessage = commitMessage.replace(/\n/g, '');

            shell.exec('pwd', {
              silent: false
            }).stdout;


            shell.cd('../repoFolder', {
              silent: false
            }).stdout;
            shell.exec('git checkout ${2}', {
              silent: false
            }).stdout;
            shell.exec('git reset --hard', {
              silent: false
            }).stdout;
            shell.exec('git pull', {
              silent: false
            }).stdout;


            shell.exec('echo -n > ../VoColApp/jsonDataFiles/syntaxErrors.json').stdout;
            var pass = true;
            var data = shell.exec('find . -type f -name \'*.ttl\'', {
              silent: false
            });
            // result of searched file of .ttl
            var files = data.split(/[\n]/);
            var errors = "";
            shell.mkdir('../VoColApp/helper/tools/serializations');

            for (var i = 0; i < files.length - 1; i++) {
              // validation of the turtle files
              var output = shell.exec('ttl ' + files[i] + '', {
                silent: true
              })
              // converting file from turtle to ntriples format
              shell.exec('rapper -i turtle -o ntriples ' + files[i] + ' >> ../VoColApp/helper/tools/serializations/SingleVoc.nt', {
                silent: false
              }).stdout;
              // check if there are syntax errors of turtle format
              if (!output.stdout.includes("0 errors.")) {
                errors += "<h3>Error in file " + files[i] + "</h3><h4>" + output.split('\n')[0] + "</h4><br/>";
                pass = false;
              }
              console.log(files[i]);
            }
            // display syntax errors
            console.log("Errors:\n" + errors);
            if (errors) {
              var filePath = '../VoColApp/jsonDataFiles/syntaxErrors.json';
              fs.writeFileSync(filePath, errors);
              console.log("Errors file is generated\n");
              shell.cd('../VoColApp/');
              shell.exec('pwd').stdout

            }

            //if no syntax errors, then contiune otherwise stop
            if (pass) {
              // converting back to turtle format
              shell.exec('rapper -i ntriples  -o turtle ../VoColApp/helper/tools/serializations/SingleVoc.nt > ../VoColApp/helper/tools/serializations/SingleVoc.ttl', {
                silent: false
              }).stdout;
              // Kill fuseki if it is running
              shell.cd('-P', '../VoColApp/helper/tools/apache-jena-fuseki');
              shell.exec('fuser -k 3030/tcp', {
                silent: false
              }).stdout;
              shell.exec('rm run/system/tdb.lock', {
                silent: false
              }).stdout;
              // show the cuurent path
              shell.exec('pwd');
              // generation the Json files
              shell.cd("../JenaJsonFilesGenrator/").stdout;
              shell.exec('java -jar JenaJsonFilesGenerator.jar').stdout;
              shell.exec('pwd');

              // display visualization part if the user selected it from the configuration page
              if (obj.visualization === "true") {
                shell.exec('pwd');
                shell.cd('../owl2vowl/').stdout;
                shell.exec('java -jar owl2vowl.jar -file ../serializations/SingleVoc.ttl', {
                  silent: false
                }).stdout;
                shell.mv('SingleVoc.json', '../../../views/webvowl/js/data/').stdout;
              }

              ////////////////////////////////////////////////////////////////////
              //// TurtleEditor
              //////////////////////////////////////////////////////////////////////
              if (obj.turtleEditor === "true" && obj.repositoryService === "gitHub") {
                shell.exec('pwd', {
                  silent: false
                }).stdout;
                // filePath where we read from
                var filePath = '../../../views/turtleEditor/js/turtle-editor.js';
                // read contents of the file with the filePath
                var contents = fs.readFileSync(filePath, 'utf8');
                contents = contents.replace(/(owner\.val\(")(.*?)"/mg, "owner.val(\"" + obj.repositoryOwner + "\"");
                contents = contents.replace(/(repo\.val\(")(.*?)"/mg, "repo.val(\"" + obj.repositoryName + "\"");
                // write back to the file with the filePath
                fs.writeFileSync(filePath, contents);
              }

              if (obj.evolutionReport === "true") {
                // Evolution Part
                if (fs.existsSync('../evolution/SingleVoc.ttl')) {
                  shell.cd('../owl2vcs/').stdout;
                  //  shell.mkdir('../evolution');
                  shell.exec('pwd');
                  // add commit details when user make new commit
                  var commitDetails = "";
                  if (commitTimestamp != "")
                    commitDetails = "commitTimestamp:"+commitTimestamp + "\n" + "pusher:"+pusher + "\n" + "commitMessage:"+commitMessage;
                  var evolutionReport = shell.exec('./owl2diff ../evolution/SingleVoc.ttl ../serializations/SingleVoc.ttl', {
                    silent: false
                  }).stdout;
                  if (evolutionReport.includes('+') || evolutionReport.includes('-')) {
                    fs.appendFileSync('../evolution/evolutionReport.txt', commitDetails + evolutionReport);
                  }
                }
                shell.exec('pwd', {
                  silent: false
                }).stdout;
                shell.mkdir('../evolution').stdout;
                shell.cp('../serializations/SingleVoc.ttl', '../evolution/SingleVoc.ttl').stdout;
              }

              ////////////////////////////////////////////////////////////////////
              // client hooks
              ////////////////////////////////////////////////////////////////////
              //TODO: just disable for testing perpose
              /*
              if (obj.clientHooks === "true") {
                shell.exec("pwd"); // in repoFolder path
                console.log('this is client-side services');
                shell.cd('../../../../repoFolder');
                shell.cp('-r', '../VoColApp/helper/tools/VoColClient/Hooks', 'VoColClient/');
                shell.cd('-P', 'VoColClient');
                shell.exec("pwd");
                //TODO: change to obj.server
                shell.exec('sed -i "s/serverURL/localhost:3000/g" pre-commit', {
                  silent: false
                }).stdout;
                shell.exec('pwd');
                //shell.cd("../../../../repoFolder"); // in repoFolder path
                //shell.exec('mv ../VoColApp/helper/tools/VoColClientService/* .git/hooks/').stdout;
                shell.exec('pwd');
                shell.exec('git add .', {
                  silent: false
                }).stdout;
                shell.exec('git commit -m "configuration of repository"', {
                  silent: false
                }).stdout;
                //TODO*:change  the following login
                // shell.exec('git push', {
                //   silent: false
                // }).stdout;
                // if (obj.repositoryService === 'gitHub')
                //   shell.exec('git push', {
                //     silent: false
                //   }).stdout;
                // else if (obj.repositoryService === 'gitLab')
                //   shell.exec('git push https://' + obj.user + ':' + obj.password + '@gitlab.com/"' + obj.repositoryName + '".git master', {
                //     silent: false
                //   }).stdout;
                // else if (obj.repositoryService === 'BitBucket')
                //   shell.exec('git push https://' + obj.user + ':' + obj.password + '@bitbucket.org/"' + obj.repositoryName + '".git', {
                //     silent: false
                //   }).stdout;
                //shell.cd('../VoColApp/helper/scripts/'); //VoColClient
                //shell.exec('pwd').stdout; //VoColClient

                shell.cd('../VoColApp/helper/tools/VoColClient/'); //VoColClient
                shell.exec('pwd').stdout; //VoColClient

              }*/
              // run external bash script to start up both fuseki-server and VoColApp
              const child = spawn('sh', ['../../scripts/run.sh', '&']);
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

//});
module.exports = router;
