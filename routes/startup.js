var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var  jsonfile  =  require('jsonfile');
var shell = require('shelljs');
var router = express.Router();
var spawn = require('child_process').spawn;


router.get('/', function(req, res) {

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  shell.exec('pwd').stdout;
  //console.log(process.cwd());
  // check if the userConfigurations file is exist
  // for the first time of app running
  var path = "jsonDataFiles/userConfigurations.json";
  console.log(path);
  fs.exists(path, function(exists) {
    if (exists) {
      jsonfile.readFile(path, function(err, obj)  {
        if (err)
          console.log(err);

        // get out of the root of the VoColApp folder
        shell.cd('..');
        //shell.exec('chmod -R u+x .');

        var clientHooks = (obj.hasOwnProperty('clientHooks')) ? true : false;
        var webHook = (obj.hasOwnProperty('webHook')) ? true : false;
        var turtleEditor = (obj.turtleEditor === "true") ? true : false;
        var removeHistory = false;
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
          var localRepository = shell.exec('git ls-remote --get-url', {
            silent: false
          }).stdout;
          //TODO*:check the correct format to login with username and password
          console.log("loginWithUsernameandPass  " + 'https://' + obj.user + ':' + obj.password + '@' + obj.repositoryURL.slice(8));
          // check if the localRepository same same entered config
          if (localRepository === obj.repositoryURL || localRepository === 'https://' + obj.user + ':' + obj.password + '@' + obj.repositoryURL.slice(8)) {
            console.log('ready to pull');
            shell.exec('git checkout master', {
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
            //shell.exec('git clone "https://' + obj.user + ':' + obj.password + '@' + obj.repositoryURL.slice(8)+'" repoFolder',{silent:false}).stdout;
            shell.exec('git clone "' + repositoryURL + '" repoFolder', {
              silent: false
            }).stdout;
            shell.cd("repoFolder");
            removeHistory = true;
          }
        } else {
          //TODO*:change  the following login
          shell.mkdir("repoFolder");
          //shell.exec('git clone "https://' + obj.user + ':""' + obj.password + '"@' + obj.repositoryURL.slice(8)+'" repoFolder',{silent:false}).stdout;
          //shell.cd("repoFolder");

          shell.exec('git clone "' + repositoryURL + '" repoFolder', {
            silent: false
          }).stdout;
          shell.cd("repoFolder");
          removeHistory = true;
        }

        shell.exec('git checkout ${2}', {
          silent: false
        }).stdout;
        shell.exec('git reset --hard', {
          silent: false
        }).stdout;
        shell.exec('git pull', {
          silent: false
        }).stdout;

        // check // check if the user has an error and this was for first time or
        // when user has changed to another repositoryURL
        // currentrepositoryURL === "" means it is the first time
          var currentrepositoryURL = shell.exec('git ls-remote --get-url', {
            silent: false
          }).stdout;
          if(currentrepositoryURL != obj.repositoryURL){
            shell.exec('echo -n > ../VoColApp/helper/tools/evolution/evolutionReport.txt').stdout;
            console.log("evolutionReport.txt was deleted");

          }
        


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
          if (turtleEditor === true && obj.repositoryService === "gitHub") {
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
              var generationDate = 'Date:' + shell.exec('date "+%d-%m-%Y %H-%M-%S"').stdout;
              var evolutionReport = shell.exec('./owl2diff ../evolution/SingleVoc.ttl ../serializations/SingleVoc.ttl', {
                silent: false
              }).stdout;
              if (evolutionReport.includes('+') || evolutionReport.includes('-')) {
                fs.appendFileSync('../evolution/evolutionReport.txt', generationDate.trim() + evolutionReport);
              }

              // Do something
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
          if (obj.clientHooks === "true") {
            shell.exec("pwd"); // in repoFolder path
            console.log('this is client-side services');
            shell.cd('../../../../repoFolder');
            shell.cp('-r', '../VoColApp/helper/tools/VoColClient/Hooks', 'VoColClient/');
            shell.cd('-P', 'VoColClient/Hooks');
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

            shell.cd('../../../VoColApp/helper/tools/VoColClient/'); //VoColClient
            shell.exec('pwd').stdout; //VoColClient

          }
          // run external bash script to start up both fuseki-server and VoColApp
          const child = spawn('sh', ['../../scripts/run.sh', '&']);
          // show output live of process on std
          child.stdout.pipe(process.stdout);
          shell.exec('pwd');
          shell.cd('../../../.').stdout;
          // redirect to the start page
          res.redirect('./');
        } else // if it has syntaxErrors
        {
          shell.exec('pwd');
          shell.cd('../VoColApp/').stdout;
          res.redirect('./validation');
        }
      });
    } else {
      res.redirect('./config');
    }
  });
});

module.exports = router;
