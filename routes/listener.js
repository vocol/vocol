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
            var data = JSON.parse(req.body.payload);
            repositoryName = data.repository.name;
            branchName = data.ref.split('/')[2];
            commitMessage = data.head_commit.message;
            commitTimestamp = data.head_commit.timestamp;
            pusher = data.pusher.name;

          } else if (repositoryService === 'gitLab') {
            var data = JSON.parse(req.body.payload);
            repositoryName = data.repository.homepage;
            branchName = data.ref;
            commitMessage = data.commits[0].message;
          } else if (repositoryService === 'bitBucket') {
            var data = JSON.parse(req.body.payload);
            repositoryName = data.repository.links.html.href;
            branchName = data.push.changes[0].old.name;
            commitMessage = data.push.changes[0].new.target.message;
          } else {
            var data = JSON.parse(JSON.stringify(req.body));
            repositoryName = "https:\/\/ahemid@jira.iais.fraunhofer.de/stash/scm/~lhalilaj/vwsandbox.git";
            repositoryName =  repositoryNameParam;
            branchName = data.refChanges[0].refId.split('/')[2];
            commitMessage = data.changesets.values[0].toCommit.message;
            pusher =  data.changesets.values[0].toCommit.committer.name;
            var commitTimeInMilliseconds  =  data.changesets.values[0].toCommit.authorTimestamp;
	          var event = new Date(commitTimeInMilliseconds);
            commitTimestamp = event.toJSON();
            console.log("data are "+ branchName+" "+commitMessage+" "+pusher+"timestap"+commitTimeInMilliseconds+ " "+commitTimestamp);
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

            shell.exec('echo -n > ../vocol/jsonDataFiles/syntaxErrors.json').stdout;
            var pass = true;
            var data = shell.exec('find . -type f -name \'*.ttl\'', {
              silent: false
            });
            // result of searched file of .ttl
            var files = data.split(/[\n]/);
            var errors = "";
            shell.mkdir('../vocol/helper/tools/serializations');

            for (var i = 0; i < files.length - 1; i++) {
              // validation of the turtle files
              var output = shell.exec('ttl ' + files[i] + '', {
                silent: true
              })
              // converting file from turtle to ntriples format
              shell.exec('rapper -i turtle -o ntriples ' + files[i] + ' >> ../vocol/helper/tools/serializations/SingleVoc.nt', {
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
              var filePath = '../vocol/jsonDataFiles/syntaxErrors.json';
              fs.writeFileSync(filePath, errors);
              console.log("Errors file is generated\n");
              shell.cd('../vocol/');
              shell.exec('pwd').stdout

            }

            //if no syntax errors, then contiune otherwise stop
            if (pass) {
              // converting back to turtle format
              shell.exec('rapper -i ntriples  -o turtle ../vocol/helper/tools/serializations/SingleVoc.nt > ../vocol/helper/tools/serializations/SingleVoc.ttl', {
                silent: false
              }).stdout;
              // Kill fuseki if it is running
              shell.cd('-P', '../vocol/helper/tools/apache-jena-fuseki');
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
                shell.mv('SingleVoc.json', '../../../views/webvowl/data/').stdout;
              }

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
                    commitDetails = "commitTimestamp:" + commitTimestamp + "\n" + "pusher:" + pusher + "\n" + "commitMessage:" + commitMessage;
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

              // run external bash script to start up both fuseki-server and vocol
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

module.exports = router;
