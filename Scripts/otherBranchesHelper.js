var fs = require('fs');

var branchName = process.argv[2];

var branches = fs.readFileSync('/home/vagrant/schemaorg/docs/otherBranches.json');

var config = JSON.parse(branches);

var stringFormat = JSON.stringify(config);

if (!stringFormat.includes(branchName)) {
  config.push({
    "branchName": branchName
  });
  var configJSON = JSON.stringify(config);
  fs.writeFileSync('/home/vagrant/schemaorg/docs/otherBranches.json', configJSON);
}
