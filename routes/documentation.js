var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
console.log(process.cwd());
  var filePath = 'jsonDataFiles/RDFSConcepts.json'
  fs.exists(filePath, function(exists) {
    if (exists) {
      var appdata = require('../jsonDataFiles/RDFSConcepts.json');
      var SKOSData = require('../jsonDataFiles/SKOSConcepts.json');
      var RDFObjectsPlusURI = require('../jsonDataFiles/RDFSObjects.json');
      var SKOSObjectsPlusURI = require('../jsonDataFiles/SKOSObjects.json');


      var treeData = [];
      // loop to find the classes

      function SortConcepts(x, y) {
        return ((x.concept.toLowerCase() == y.concept.toLowerCase()) ? 0 : ((x.concept.toLowerCase() > y.concept.toLowerCase()) ? 1 : -1));
      }

      function SortFiles(x, y) {
        return ((x.toLowerCase() == y.toLowerCase()) ? 0 : ((x.toLowerCase() > y.toLowerCase()) ? 1 : -1));
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

      function uniquefileNames(array) {
        var out = [];
        var sl = array;

        for (var i = 0, l = sl.length; i < l; i++) {
          var unique = true;
          for (var j = 0, k = out.length; j < k; j++) {
            if (sl[i] !== undefined)
              if (sl[i].toLowerCase() === out[j].toLowerCase()) {
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
      appdata.sort(SortConcepts);
      appdata = uniqueConcepts(appdata);
      appdata.forEach(function(item) {
        treeData = treeData.concat(item);
        //console.log(treeData);
      });
      var files = [];
      appdata.forEach(function(item) {
        files.push(item.fileName);
      });
      files.sort(SortFiles);
      files = uniquefileNames(files);

      var concepts = [];
      var allRDFObjects = filterExternalConcept(RDFObjectsPlusURI);
      var allSKOSObjects = filterExternalConcept(SKOSObjectsPlusURI);

      res.render('documentation', {
        title: 'documentation',
        data: treeData,
        fileNames: files,
        allRDFObjects: allRDFObjects,
        allSKOSObjects: allSKOSObjects,
        SKOSData: SKOSData,
        RDFObjectsPlusURI: RDFObjectsPlusURI,
        SKOSObjectsPlusURI: SKOSObjectsPlusURI
      });
    }
    else{res.render('emptyPage', {
      title: 'documentation'
    });

    }
  });
});
module.exports = router;
