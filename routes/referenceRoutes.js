var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login'
    });
  else {
    var searchedConcept = req.originalUrl;
    searchedConcept = searchedConcept.substr(1);
    if (searchedConcept.charAt(0) == '/')
      searchedConcept = searchedConcept.split('/')[1];
    var filePath = 'jsonDataFiles/RDFSConcepts.json'
    fs.exists(filePath, function(exists) {
      if (exists) {
        var RDFSdata = require('../jsonDataFiles/RDFSConcepts.json');
        var SKOSData = require('../jsonDataFiles/SKOSConcepts.json');
        var RDFObjectsPlusURI = require('../jsonDataFiles/RDFSObjects.json');
        var SKOSObjectsPlusURI = require('../jsonDataFiles/SKOSObjects.json');
        var OWLIndividuals = require('../jsonDataFiles/OWLIndividiuals.json');

        var treeData = [];


        function SortConcepts(x, y) {
          return ((x.concept.toLowerCase() == y.concept.toLowerCase()) ? 0 : ((x.concept.toLowerCase() > y.concept.toLowerCase()) ? 1 : -1));
        }


        function uniqueConcepts(array) {
          var out = [];
          var sl = array;
          for (var i = 0, l = sl.length; i < l; i++) {
            var unique = true;
            for (var j = 0, k = out.length; j < k; j++) {
              if (sl[i] !== undefined)
                if (sl[i].concept.toLowerCase() === out[j].concept.toLowerCase()) {
                  unique = false;
                }
            }
            if (unique) {
              out.push(sl[i]);
            }
          }
          return out;
        }


        // filter external classes
        function filterExternalConcept(RDFObjects) {
          var out = [];
          var data = [];
          for (var i = 0, j = 0, l = RDFObjects.length; i < l; i++) {
            if (typeof(RDFObjects[i].object) != "undefined") {
              data[j] = RDFObjects[i].object;
              j++;
            }

          }
          for (var i = 0, l = data.length; i < l; i++) {
            var unique = true;
            for (var j = 0, k = out.length; j < k; j++) {
              if (data[i] === out[j])
                unique = false;
            }
            if (unique) {
              out.push(data[i]);
            }
          }
          return out;
        }

        // translation of concept to URI
        function findURI(array, item) {
          var i = 0;
          while (array[i].concept != item) {
            i++;
          }
          return array[i].URI;
        }

        // Call Sort By Name
        RDFSdata.sort(SortConcepts);
        RDFSdata = uniqueConcepts(RDFSdata);
        RDFSdata.forEach(function(item) {
          treeData = treeData.concat(item);
        });

        var allRDFObjects = filterExternalConcept(RDFObjectsPlusURI);
        var allSKOSObjects = filterExternalConcept(SKOSObjectsPlusURI);

        res.render('referenceRoutes', {
          title: 'referenceRoutes',
          data: treeData,
          allRDFObjects: allRDFObjects,
          allSKOSObjects: allSKOSObjects,
          SKOSData: SKOSData,
          RDFObjectsPlusURI: RDFObjectsPlusURI,
          SKOSObjectsPlusURI: SKOSObjectsPlusURI,
          OWLIndividuals: OWLIndividuals,
          referenceItem: searchedConcept
        });
      }
    });
  }
});
module.exports = router;
