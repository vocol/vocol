var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var  jsonfile  =  require('jsonfile');
var shell = require('shelljs');
var router = express.Router();
var spawn = require('child_process').spawn;

shell.exec('echo "{}" > ../vocol/jsonDataFiles/syntaxErrors.json').stdout;
var pass = true;
var data = shell.exec('find . -type f -name "*.ttl"', {
  silent: false
});


        // result of searched file of .ttl
        var files = data.split(/[\n]/);
        var k = 1;
        var errors = [];
        shell.mkdir('../vocol/helper/tools/serializations');
        shell.exec('rm -f   ../vocol/helper/tools/serializations/SingleVoc.nt',{
          silent: false
        }).stdout;
        shell.exec('rm -f   ../vocol/helper/tools/ttl2ntConverter/temp.nt',{
          silent: false
        }).stdout;
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
if(!pass){
  if (errors) {
    // display syntax errors
    console.log("Errors:\n" + JSON.stringify(errors));
    shell.cd('../vocol/jsonDataFiles/').stdout;
    var pathErrorFile = shell.exec('pwd').stdout;
    shell.cd('../.').stdout;
    var filePath = pathErrorFile.trim() + '/' + 'syntaxErrors.json';
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
}
else{
  // delete previous data if there is any
  shell.exec('rm -f ../vocol/views/webvowl/data/SingleVoc.json').stdout;
  shell.exec('rm -f ../vocol/jsonDataFiles/RDFSConcepts.json').stdout;
  shell.exec('rm -f ../vocol/jsonDataFiles/SKOSConcepts.json').stdout;
  shell.exec('rm -f ../vocol/jsonDataFiles/SKOSObjects.json').stdout;
  shell.exec('rm -f ../vocol/jsonDataFiles/RDFSObjects.json').stdout;
  shell.exec('rm -f ../vocol/jsonDataFiles/OWLIndividuals.json').stdout;
  shell.exec('rm -f ../vocol/helper/tools/ttl2ntConverter/temp.nt').stdout;
// Kill fuseki if it is running
shell.cd('-P', '../vocol/helper/tools/apache-jena-fuseki');
shell.exec('fuser -k '+process.argv.slice(2)[1] || 3030+'/tcp', {
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
}
