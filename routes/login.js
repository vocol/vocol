var express = require('express');
var bodyParser = require('body-parser');
var shell = require('shelljs');
var exec = require('child_process').exec;
var router = express.Router();
var fs = require('fs');
var app = express();

router.post('/', function(req, res) {
  res.redirect('./');

});

router.get(['/'], function(req, res) {
  res.render('login.ejs', {
    title: 'login'
  });
});

module.exports = router;
