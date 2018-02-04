var express = require('express');
var router = express.Router();
var fs = require('fs');
var escapeHtml = require('escape-html');
var shell = require('shelljs');
var session = require('express-session');


/* GET users listing. */
router.get('/', function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login'
    });
  else {
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
        console.log(arrayLines);
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
              content: "Commit Message: &quot;"+commitMessage + "&quot;<br/>" + "User: &quot;"+pusher+"&quot;<a href='#"+commitTimestamp+"'>Show more details</a>",
              start: commitTimestamp,
              link: '#' + commitTimestamp,
              commitMessage: commitMessage,
              pusher: pusher
            };
            history.push(commitObject);
            k++;
          }
          if (arrayLines[i].charAt(0) == '+') {
            element = arrayLines[i].substr(2);
            if (arrayLines[i].includes("_:file:")) {
              element = element.split("_:file:")[0];
            }
            diffArray.push({
              'event': 'addition',
              'value': escapeHtml(element),
              'commitMessage': commitMessage,
              'pusher':pusher,
              'commitTimestamp': commitTimestamp
            });
          } else if (arrayLines[i].charAt(0) == '-') {
            element = arrayLines[i].substr(2);
            if (arrayLines[i].includes("_:file:")) {
              element = element.split("_:file:")[0];
          }
          diffArray.push({
            'event': 'deletion',
            'value': escapeHtml(element),
            'commitMessage': commitMessage,
            'pusher':pusher,
            'commitTimestamp': commitTimestamp
          });
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
}
});

module.exports = router;
