var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var  jsonfile  =  require('jsonfile');
var shell = require('shelljs');
var router = express.Router();
var spawn = require('child_process').spawn;

shell.exec('echo -n > ../vocol/jsonDataFiles/syntaxErrors.json').stdout;
var pass = true;
var data = shell.exec('find . -type f -name "*.ttl"', {
  silent: false
});


        // result of searched file of .ttl
        var files = data.split(/[\n]/);
        var k = 1;
        var errors = [];
        shell.mkdir('../vocol/helper/tools/serializations');
        for (var i = 0; i < files.length - 1; i++) {
          // validation of the turtle files
          var output = shell.exec('ttl ' + files[i] + '', {
            silent: true
          })
          shell.cd('../vocol/helper/tools/ttl2ntConverter/').stdout;

          // converting file from turtle to ntriples format
          shell.exec('java -jar ttl2ntConverter.jar ../../../../repoFolder' + files[i].substring(1) + ' temp.nt ', {
            silent: false
          }).stdout;
          shell.exec('cat  temp.nt | tee -a  ../serializations/SingleVoc.nt', {
            silent: false
          }).stdout;

          shell.cd('../../../../repoFolder/').stdout;

          // check if there are syntax errors of turtle format
          if (!output.stdout.includes("0 errors.")) {
            var errorObject = {
              id: k,
              file: files[i],
              errMessege: output.split('\n')[0]
            };
            errors.push(errorObject)
            k++;
            pass = false;
          }
        }

// display syntax errors
console.log("Errors:\n" + JSON.stringify(errors));
if (errors) {
  shell.cd('../vocol/helper/tools/VoColClient/').stdout;
  shell.exec('fuser -k 3030/tcp').stdout;
  const child = spawn('sh', ['../../scripts/run.sh', '&']);
  shell.cd('../../../../repoFolder/').stdout;
  var filePath = '../vocol/jsonDataFiles/syntaxErrors.json';
  shell.exec('pwd');
  jsonfile.writeFile(filePath, errors, {
    spaces:  2,
     EOL:   '\r\n'
  },  function(err)  {  
    if (err)
      throw err;
    console.log("Errors file is generated\n");

  })
}


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
shell.exec('pwd');
shell.cd('../owl2vowl/').stdout;
shell.exec('java -jar owl2vowl.jar -file ../serializations/SingleVoc.nt', {
  silent: false
}).stdout;
shell.mv('SingleVoc.json', '../../../views/webvowl/data/').stdout;

// run external bash script to start up both fuseki-server and vocol
const child = spawn('sh', ['../../scripts/run.sh', '&']);
// show output live of process on std
child.stdout.pipe(process.stdout);
shell.exec('pwd');
shell.cd('../../../.').stdout;
