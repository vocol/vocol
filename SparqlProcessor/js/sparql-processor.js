// see https://www.npmjs.com/package/github-client
// and http://getbootstrap.com/css/ (styles for prettiness)
// and http://codemirror.net/ (text editor with syntax highlighting)
// and https://github.com/RubenVerborgh/N3.js (Turtle parser)


define(['jquery', 'github', 'N3', 'lib/codemirror',
        'addon/hint/show-hint', 'mode/turtle/turtle', 'hint/turtle-hint',
        'logger', 'lib/rdfstore'],

function($, Github, N3, CodeMirror, ShowHint, ModeTurtle, HintTurtle, logger, rdfstore) {

  // HTML elements ------------------------------------------------------------

  var menu =  $("#menu");
  var queryEditor = $("#sparqlQuery");
  var buttonQuery = $("#button-query");
  var fileDisp = $(".current-filename");
  var resultTable  = $("#resultTable");
  var inputContents = $("#inputContents");
  var orga = "";
  var repo = "";
  var file = "";

  var editor = CodeMirror.fromTextArea(inputContents[0],
                                             { mode: "turtle",
                                               autofocus: false,
                                               lineNumbers: true,
                                               height: 40,
                                               gutters: ["CodeMirror-linenumbers", "breakpoints"]
                                             });

   var sparqlEditor = CodeMirror.fromTextArea(queryEditor[0],
                                             { mode: "turtle",
                                               autofocus: false,
                                               lineNumbers: true,
                                                 height: 10,
                                               gutters: ["CodeMirror-linenumbers", "breakpoints"]
                                             });



  var readLocationHash = function() {
    rawRepoLink = window.location.hash;
    var fileLink = rawRepoLink.slice(1);
    $("#repoLink").text(fileLink);

    // $(".current-filename").html(fileLink);
    var arr = fileLink.split("/");
    orga = arr[0];
    repo = arr[1];
    file = arr[2];

    // set link
    var githubURI = "https://github.com";
    $("#github-link").attr("href", githubURI + "/" + orga + "/" + repo + "/");
  };


  // Github Interaction -------------------------------------------------------
  
  var loadFromGitHub = function () {
      var gh = new Github({
          username: "",
          password: ""
        });

    repo = gh.getRepo(orga, repo);
    branch = repo.getBranch("master");
    branch.read(file, "true")
      .done(function(contents) {
        // clean up result
           contents.content = contents.content.substring(0, contents.content.length - 1);

           editor.setValue(contents.content);
      })
      .fail(function(err) {
          logger.error("Read from GitHub failed", err);
      }
    );
  };

   var runQuery = function() 
   {
       resultTable.children().remove();

       vocabulary = editor.getValue();
       queryString = sparqlEditor.getValue();

      // create graph store
      rdfstore.create(function(err, store) 
      {
        store.load("text/turtle", vocabulary, function(err, results) 
        {   
          if(err)
          {
            logger.debug("store load error", err);
            logger.error("Could not Run SPARQL Query:", err.message);
          }else
          {
            // run query
            store.execute(queryString, function(err, results)
            {
              // build first row
              var listOfSelects = Object.keys(results[0]);
             
              var firstRow = "<tr>";
              for(var key in listOfSelects)
              {
                firstRow += "<th>" + listOfSelects[key] + "</th>";
              }
              firstRow += "</tr>";
              resultTable.append(firstRow); 

              // print results
              for (var i = 0; i < results.length; i++) 
              {
                  var resultSet = results[i];
                  console.log("resultSet: " + resultSet);
                  var newRow = "<tr>";
                  for(var key in resultSet)
                  { 
                    newRow += "<td>" + resultSet[key].value + "</td>";
                  }
                  newRow += "</tr>";
                  resultTable.append(newRow)
               };
          });
        };
      });
    });
  };

    buttonQuery.bind("click", runQuery);

  $('query1').click( function() { 
     var query1 = "PREFIX mv: <http://purl.org/net/mobivoc/> \
                    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>  \
                    PREFIX schema: <http://schema.org> \
\
                    SELECT ?name ?openingHours ?streetAddress ?postCode ?city\
                    WHERE \
                    {\
                      ?station a mv:FillingStation .\
                      ?station rdfs:label ?name .\
                      ?station mv:hasOpeningHours ?openingHours .\
                      ?station mv:isLocated ?location .\
                      ?location schema:streetAddress ?streetAddress .\
                      ?location schema:postalCode ?postCode .\
                      ?location schema:addressLocality ?city .\
                     }"
        sparqlEditor.setValue(query1);
        return false; 

   } );

  $(document).ready(function() {
     readLocationHash();
     loadFromGitHub();
  });

});
