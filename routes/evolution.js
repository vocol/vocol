var express = require('express');
var router = express.Router();
var fs = require('fs');
var escapeHtml = require('escape-html');
var shell = require('shelljs');

/* GET users listing. */
router.get('/', function(req, res) {

  var path = "helper/tools/evolution/evolutionReport.txt";
  var diffArray = [];
  var history = [];
  var isExistEvolutionReportFile = false;

  fs.exists(path, function(exists) {
      if (exists) {
        var evolutionReport = fs.readFileSync(path).toString();
        if (evolutionReport.includes('+') || evolutionReport.includes('-')) {
          isExistEvolutionReportFile = true;
        }
        var arrayLines = evolutionReport.split("\n");
<<<<<<< HEAD
        console.log(arrayLines);
        //arrayLines.pop();
=======

        arrayLines.pop();
>>>>>>> 605efe411cacf5f9bb425972e5d2842e34597d46
        var k = 0;
        var commitTimestamp = "";
        var pusher = "";
        var commitMessage = "";
        for (var i = 0; i < arrayLines.length; i++) {
          var element = "";
          if (arrayLines[i].includes('commitTimestamp:')) {
            element = arrayLines[i];
            element = element.split("commitTimestamp:")[1];
            // get the commitTimestamp
            commitTimestamp = element.split("+")[0];
            if (arrayLines[i+1].includes('pusher:')) {
              element = arrayLines[i+1];
              pusher = element.split("pusher:")[1];
              i++;
            }
            if (arrayLines[i + 1].includes('commitMessage:')) {
              element = arrayLines[i + 1];
              commitMessage = element.split("commitMessage:")[1];
              i++;
            }
            // object for timeLine
            var commitObject = {
              id: k,
<<<<<<< HEAD
              content: "Commit Message: &quot;"+commitMessage + "&quot;<br/>" + "User: &quot;"+pusher+"&quot;<a href='#"+commitTimestamp+"'>Show more details</a>",
              start: commitTimestamp,
              link: '#' + commitTimestamp,
              commitMessage: commitMessage,
              pusher: pusher
=======
              content: "Commit Message: &quot;"+commitMessage + "&quot;<br/>" + "User: &quot;"+pusher+"&quot;",
              start: commitTimestamp,
              link: '#' + commitTimestamp
>>>>>>> 605efe411cacf5f9bb425972e5d2842e34597d46
            };
            history.push(commitObject);
            k++;
          }
          if (arrayLines[i].charAt(0) == '+') {
            element = arrayLines[i].substr(2);
            if (arrayLines[i].includes("_:file:")) {
              element = element.split("_:file:")[0];
<<<<<<< HEAD
            }
            diffArray.push({
              'event': 'addition',
              'value': escapeHtml(element),
              'commitMessage': commitMessage,
              'pusher':pusher,
              'commitTimestamp': commitTimestamp
            });
=======
              diffArray.push({
                'event': 'add',
                'value': escapeHtml(element),
                'commitMessage': commitMessage,
                'pusher':pusher,
                'commitTimestamp': commitTimestamp
              });
            }
>>>>>>> 605efe411cacf5f9bb425972e5d2842e34597d46
          } else if (arrayLines[i].charAt(0) == '-') {
            element = arrayLines[i].substr(2);
            if (arrayLines[i].includes("_:file:")) {
              element = element.split("_:file:")[0];
<<<<<<< HEAD
          }
          diffArray.push({
            'event': 'deletion',
            'value': escapeHtml(element),
            'commitMessage': commitMessage,
            'pusher':pusher,
            'commitTimestamp': commitTimestamp
          });
=======
              diffArray.push({
                'event': 'del',
                'value': escapeHtml(element),
                'commitMessage': commitMessage,
                'pusher':pusher,
                'commitTimestamp': commitTimestamp
              });
          }
>>>>>>> 605efe411cacf5f9bb425972e5d2842e34597d46
    }
  }
}
    if (isExistEvolutionReportFile === true)
      res.render('evolution', {
        title: 'Evolution',
        evolutionReport: diffArray,
        history: history
      });
    else
      res.render('evolution', {
        title: 'Evolution',
        history: "",
        evolutionReport: ""
      });
  });
});

module.exports = router;
