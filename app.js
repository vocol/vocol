var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var contactus = require('./routes/contactus');
var users = require('./routes/users');
var documentation = require('./routes/documentation');
var evolution = require('./routes/evolution');
var startup = require('./routes/startup');
var validation = require('./routes/validation');
var client = require('./routes/clientServices');
var listener = require('./routes/listener');
var fs = require('fs');
var  jsonfile  =  require('jsonfile');
var app = express();
var watch = require('node-watch');
var shell = require('shelljs');
var router = express.Router();
var  proxy  =  require('express-http-proxy');
var shell = require('shelljs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.locals.isExistSyntaxError = false;
var ErrorsFilePath = __dirname + '/jsonDataFiles/syntaxErrors.json';

function readSyntaxErrorsFile() {
  if (fs.existsSync(ErrorsFilePath)) {
    var data = fs.readFileSync(ErrorsFilePath);
    if (data.toString().includes('Error')) {
      app.locals.isExistSyntaxError = true;
    } else {
      app.locals.isExistSyntaxError = false;
    }
  }
}
// call at the first time
readSyntaxErrorsFile();

// check if the userConfigurations file is exist
// for the first time of app running
var userConfigurationsFile = __dirname + '/jsonDataFiles/userConfigurations.json';
var repositoryURL = "";
app.locals.projectTitle = "MobiVoc";
app.locals.userConfigurations = Array(6).fill(true);

function readUserConfigurationFile() {
  if (fs.existsSync(userConfigurationsFile)) {
    var data = fs.readFileSync(userConfigurationsFile);
    if (data.includes('vocabularyName')) {
      jsonfile.readFile(userConfigurationsFile, function(err, obj) {
        var menu = Array(6).fill(false);
        Object.keys(obj).forEach(function(k) {
          if (k === "vocabularyName") {
            // store projectTitle to be used by header.ejs
            app.locals.projectTitle = obj[k];
          } else if (k === "repositoryURL") {
            // store repositoryURL to be checked if it was uploaded
            // for first time or was changed to another repository
            repositoryURL = obj[k];
          } else if (k === "turtleEditor") { //menu[0]
            menu[0] = true;
            // do more stuff
          } else if (k === "documentationGeneration") { //menu[1]
            menu[1] = true;
          } else if (k === "visualization") { //menu[2]
            menu[2] = true;
          } else if (k === "sparqlEndPoint") { //menu[3]
            menu[3] = true;
          } else if (k === "evolutionReport") { //menu[4]
            menu[4] = true;
          } else if (k === "analytics") { //menu[5]
            menu[5] = true;
          }
        });
        app.locals.userConfigurations = menu;
        console.log(menu);
      });
    }
  }
}
// call at the first time
readUserConfigurationFile();

// check if the user has an error and this was for first time or
// when user has changed to another repositoryURL
// currentrepositoryURL === "" means it is the first time
var currentrepositoryURL = "";
var repoFolderPath = "../repoFolder";
if (fs.existsSync(repoFolderPath)) {
  currentrepositoryURL = shell.exec('git ls-remote --get-url', {
    silent: false
  }).stdout;
  shell.cd('../VoColApp', {
    silent: false
  }).stdout;
}

app.locals.showEmptyPge = false;

function showEmptyPgeFunc() {
  if (app.locals.isExistSyntaxError === true && (currentrepositoryURL === "" || repositoryURL != currentrepositoryURL)) {
    app.locals.showEmptyPge = true;
  } else
    app.locals.showEmptyPge = false;
  console.log('showEmptyPge' + app.locals.showEmptyPge);
}
showEmptyPgeFunc();

// routing to the available routes on the app
app.use('\/\/', routes);
app.use('\/\/contactus', contactus);
app.use('\/\/users', users);
app.use('\/\/documentation', documentation);
app.use('\/\/webvowlLink', express.static(path.join(__dirname, "views/webvowl")));
app.use('\/\/turtleEditorLink', express.static(path.join(__dirname, "views/turtleEditor")));
app.use('\/\/analyticsLink', express.static(path.join(__dirname, "views/d3sparql")));
app.use('\/\/evolution', evolution);
app.use('\/\/startup', startup);
app.use('\/\/validation', validation);
app.use('\/\/client', client);
app.use('\/\/listener', listener);

app.use('\/\/fuseki/',  proxy('localhost:3030/',   {  
  proxyReqPathResolver:   function(req)  {
    console.log(require('url').parse(req.url).path);    
    return  require('url').parse(req.url).path;  
  }
}));

app.use('\/\/fusekiOld/', proxy('localhost:3080/', {
  proxyReqPathResolver: function(req) {
    console.log(require('url').parse(req.url).path);
    return require('url').parse(req.url).path;
  }
}));

app.get('\/\/analytics', function(req, res) {
  res.render('analytics', {
    title: 'Analytics'
  });
})

app.get('\/\/turtleEditor', function(req, res) {
  res.render('turtleEditor', {
    title: 'Editing'
  });
})

app.get('\/\/visualization', function(req, res) {
  res.render('visualization', {
    title: 'visualization'
  });
})


app.get('\/\/querying', function(req, res) {
  res.render('querying.ejs', {
    title: 'Make a query'
  });
});


app.get('\/\/config', function(req, res) {
  res.render('config.ejs', {
    title: 'Configuration App'
  });
});

// http post when  a user configurations is submitted
app.post('\/\/config', function(req, res) {
  var filepath = __dirname + '/jsonDataFiles/userConfigurations.json';
  // Read the userConfigurations file if exsit to append new data
  jsonfile.readFile(filepath, function(err, obj)  {
    if (err)
      console.log(err);  
    jsonfile.writeFile(filepath, req.body, {
      spaces:  2,
       EOL:   '\r\n'
    },  function(err)  {  
      if (err)
        throw err;

    })
  });
  res.render('userConfigurationsUpdated', {
    title: 'System Preparation'
  });
});

// monitor ErrorsFilePath
watch(ErrorsFilePath, {
  recursive: true
}, function(evt, name) {
  if (evt == 'update') {
    // call if SyntaxErrors file was changed
    readSyntaxErrorsFile();
    console.log(app.locals.isExistSyntaxError);
    showEmptyPgeFunc();
  }
});

// monitor change of userConfigurationsFile
watch(userConfigurationsFile, {
  recursive: true
}, function(evt, name) {
  if (evt == 'update') {
    // call if userConfigurations file was changed
    readUserConfigurationFile();
    console.log(app.locals.isExistSyntaxError);
  }
});


function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});


module.exports = app;
