var fs = require('fs');

var uniqueID = process.argv[2];

var commitMessage = process.argv[3];

console.log(commitMessage);

var configFile = fs.readFileSync('/home/vagrant/schemaorg/docs/data.json');
var config = JSON.parse(configFile);
config.push({
  "start": new Date(),
  "content": commitMessage + "</br><a href=\"#" + uniqueID + "\">More Details</a>"
});
var configJSON = JSON.stringify(config);
fs.writeFileSync('/home/vagrant/schemaorg/docs/data.json', configJSON);
