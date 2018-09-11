var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsonfile = require('jsonfile');
var session = require('express-session');
var request = require('request');
var SparqlClient = require('sparql-client');
var shell = require('shelljs');
var endpointPortNumber = process.argv.slice(2)[1] || 3030;
var endpoint = 'http:\//localhost:' + endpointPortNumber.toString() +
  '/dataset/sparql';
var client = new SparqlClient(endpoint);
var escapeHtml = require('escape-html');
const ejs = require('ejs');

//  GET home page.
router.get('/', function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login'
    });
  else {

    var acceptHeader = req.headers['accept'];
    // return all turtle code inside fuseki endpoint if content-type is turtle
    if (acceptHeader === 'text/turtle' ||
      acceptHeader === 'text/ntriples' ||
      acceptHeader === 'application/rdf+xml' ||
      acceptHeader === 'application/ld+json') {
      var queryObject = 'CONSTRUCT{?s ?p ?o .}WHERE {?s ?p ?o .}';
      var endpoint = "http:\/\/localhost:" + process.argv.slice(2)[1] ||
        3030 + "/dataset/sparql?query="
      request({
        url: endpoint + queryObject,
        headers: {
          'accept': acceptHeader
        },
      }, function(error, response, body) {
        if (error) {
          console.log('error:', error); // Print the error if one occurred
        } else if (response && body) {
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          if (body) {
            res.write("RDF code in " + acceptHeader + ":\n");
            res.write(
              "========================================================\n"
            );
            res.write(body);
            res.end();
          } else {
            res.send("No data is found ");
          }
        }
      })
    } else {
      var metaData = "";
      var statistics = "";
      var query_r = {};
      var qe = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
      PREFIX owl: <http://www.w3.org/2002/07/owl#> \
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
      SELECT \
      (count(?cls) as ?Classes)\
      (count(?rdfProperty) as ?RDF_Property)\
      (count(?objProp) as ?OWL_ObjectProperty) \
      (count(?dtProp) as ?OWL_DatatypeProperty) \
      (count(?annot) as ?OWL_AnnotationProperty)\
      (count(?indiv) as ?Individuals)\
      WHERE {{?objProp a owl:ObjectProperty.} \
      UNION {?dtProp a owl:DatatypeProperty.}\
      UNION {?indiv a owl:NamedIndividual.} \
      UNION {?annot a owl:AnnotationProperty.} \
      UNION {?cls a rdfs:Class. FILTER(!isBlank(?cls))} \
      UNION {?cls a owl:Class. FILTER(!isBlank(?cls))} \
	    UNION {?rdfProperty a rdf:Property.}	  \
	  }";

      var qOnt = "PREFIX owl: <http://www.w3.org/2002/07/owl#> \
      SELECT ?p ?o\
      WHERE {\
      ?s a owl:Ontology.\
      OPTIONAL { ?s ?p ?o.}}";

      // check if fuseki endpoint is running
      var output = shell.exec('fuser -v -n tcp ' + endpointPortNumber.toString(), {
        silent: false
      }).stdout;
      if (output) {
        client.query(qOnt, function(error, data) { // query on dataset.
          if (error) {
            console.log(error);
          }
          var result = data.results.bindings;
          if (result[0] != null) {
            // json values of the query result
            metaData = result;
          }
          client.query(qe, function(error, data) { // query on dataset.
            if (error) {
              console.log(error);
            }
            if (data) {
              // string to hold table content
              statistics = "";
              for (key in data['results']['bindings'][0]) {
                var obj = data['results']['bindings'][0][key][
                  'value'
                ];
                if (key == "RDF_Property")
                  key = "RDF Properties";
                if (key == "OWL_ObjectProperty")
                  key = "OWL ObjectProperties";
                if (key == "OWL_DatatypeProperty")
                  key = "OWL DatatypeProperties";
                if (key == "OWL_AnnotationProperty")
                  key = "OWL AnnotationProperties";

                statistics += '<tr><td class="td_content">' +
                  key +
                  '</td><td class="right aligned">' + obj +
                  '</td></tr>';
              }
            }
            // check if the userConfigurations file is exist
            // for the first time of app running
            var path = "jsonDataFiles/userConfigurations.json";
            fs.exists(path, function(exists) {
              var data = fs.readFileSync(path);
              if (exists && data.includes('vocabularyName')) {
                jsonfile.readFile(path, function(err, obj) {
                  if (err)
                    console.log(err);
                  if (obj.hasOwnProperty(
                      'vocabularyName')) {
                    // string to hold table content
                    var repoInfo = "";
                    repoInfo += '<tr><td class="td_content"> Instance Name</td><td class="right aligned">' +
                      obj.vocabularyName + '</td></tr>';
                    repoInfo += '<tr><td class="td_content"> Repository Owner </td><td class="right aligned">' +
                      obj.repositoryOwner +
                      '</td></tr>';
                    repoInfo += '<tr><td class="td_content"> Repository Service </td><td class="right aligned">' +
                      obj.repositoryService +
                      '</td></tr>';
                    repoInfo += '<tr><td class="td_content"> Repository Branch </td><td class="right aligned">' +
                      obj.branchName + '</td></tr>';

                    res.render('index', {
                      title: 'Home',
                      metaData: metaData,
                      statistics: statistics,
                      repoInfo: repoInfo,
                      homePage: obj.text
                    });

                  }
                });
              }
            });
          });

        });

      } else {
        // check if the userConfigurations file is exist
        // for the first time of app running
        var path = "jsonDataFiles/userConfigurations.json";
        fs.exists(path, function(exists) {
          var data = fs.readFileSync(path);
          if (exists && data.includes('vocabularyName')) {
            jsonfile.readFile(path, function(err, obj) {
              if (err)
                console.log(err);
              if (obj.hasOwnProperty('text'))
                res.render('index', {
                  title: 'Home',
                  metaData: "",
                  statistics: "",
                  repoInfo: "",
                  homePage: obj.text
                });
            });
          }
        });
      }
    }
  }
});

module.exports = router;
