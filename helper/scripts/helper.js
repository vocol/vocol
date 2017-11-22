var fs = require('fs');         

var uniqueID = process.argv[2];

var commitMessage = process.argv[3];

console.log(commitMessage);
var filePath = '../../jsonDataFiles/evolutionData.json';
var configFile = fs.readFileSync(filePath);
var config = JSON.parse(configFile);
config.push({"start": new Date(), "content": commitMessage +"</br><a href=\"#"+uniqueID+"\">More Details</a>"});
var configJSON = JSON.stringify(config);
fs.writeFileSync(filePath, configJSON);

