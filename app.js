var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var documentation = require('./routes/documentation');
var evolution = require('./routes/evolution');
var startup = require('./routes/startup');
var validation = require('./routes/validation');
var client = require('./routes/clientServices');
var login = require('./routes/login');
var referenceRoutes = require('./routes/referenceRoutes');
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


app.locals.isExistSyntaxError = "false";
var ErrorsFilePath = __dirname + '/jsonDataFiles/syntaxErrors.json';
function readSyntaxErrorsFile() {
  if (fs.existsSync(ErrorsFilePath)) {
    var data = fs.readFileSync(ErrorsFilePath);
    if (data.toString().includes('Error')) {
      app.locals.isExistSyntaxError = "true";
    } else {
      app.locals.isExistSyntaxError = "false";
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
    silent: true
  }).stdout;
  shell.cd('../vocol', {
    silent: false
  }).stdout;
}

// routing to the available routes on the app
app.use(['\/\/', '/'], routes);
app.use(['\/\/documentation', '/documentation'], documentation);
app.use(['\/\/webvowlLink', '/webvowlLink'], express.static(path.join(__dirname, "views/webvowl")));
app.use(['\/\/turtleEditorLink', '/turtleEditorLink'], express.static(path.join(__dirname, "views/turtleEditor")));
app.use(['\/\/analyticsLink', '/analyticsLink'], express.static(path.join(__dirname, "views/d3sparql")));
app.use(['\/\/evolution', '/evolution'], evolution);
app.use(['\/\/startup', '/startup'], startup);
app.use(['\/\/validation', '/validation'], validation);
app.use(['\/\/client', '/client'], client);
app.use(['\/\/listener', '/listener'], listener);
app.use(['\/\/login', '/login'], login);


app.use(['\/\/fuseki/', '/fuseki/'],  proxy('localhost:3030/',   {  
  proxyReqPathResolver:   function(req)  {
    if (req.method === 'POST')
      return  require('url').parse(req.url).path + "?query=" + escape(req.body.query);
    else
      return  require('url').parse(req.url).path;
  }
}));

app.get(['\/\/analytics', '/analytics'], function(req, res) {
  res.render('analytics', {
    title: 'Analytics'
  });
})

app.get(['\/\/turtleEditor', '/turtleEditor'], function(req, res) {
  res.render('turtleEditor', {
    title: 'Editing'
  });
})

app.get(['\/\/visualization', '/visualization'], function(req, res) {
  res.render('visualization', {
    title: 'Visualization'
  });
})

app.get(['\/\/querying', '/querying'], function(req, res) {
  res.render('querying.ejs', {
    title: 'Querying'
  });
});


app.get(['\/\/config', '/config'], function(req, res) {
  res.render('config.ejs', {
    title: 'Configuration'
  });
});



// http post when  a user configurations is submitted
app.post(['\/\/config', '/config'], function(req, res) {
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
    title: 'Preparation'
  });
});

app.get(['\/\/checkErrors', '/checkErrors'], function(req, res, next) {
  readSyntaxErrorsFile();
  console.log(req.body);
  res.send(app.locals.isExistSyntaxError);
  res.end();
});

// catch something else
app.use('*', referenceRoutes);

// monitor ErrorsFilePath
watch(ErrorsFilePath, {
  recursive: true
}, function(evt, name) {
  if (evt == 'update') {
    // call if SyntaxErrors file was changed
    readSyntaxErrorsFile();
  }
});

// monitor change of userConfigurationsFile
watch(userConfigurationsFile, {
  recursive: true
}, function(evt, name) {
  if (evt == 'update') {
    // call if userConfigurations file was changed
    readUserConfigurationFile();
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
