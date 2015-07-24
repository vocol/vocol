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
  };


  // Github Interaction -------------------------------------------------------
  
  var loadFromGitHub = function () {
        console.log("start G");
      var gh = new Github({
          username: "",
          password: ""
        });

    repo = gh.getRepo(orga, repo);
    branch = repo.getBranch("master");

    branch.read(file, "true")
      .done(function(contents) {
           editor.setValue(contents.content);
      })
      .fail(function(err) {
          logger.error("Read from GitHub failed", err);
      }
    );
              console.log("finish G");
  };

   var runQuery = function() 
   {
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
              // generate table
              var firstRow =  "<tr><td><b>Subject</b></td><td><b>Predicate</b></td><td><b>Object</b></td></tr>";

              resultTable.append(firstRow); 

              for (var i = 0; i < results.length; i++) 
              {
                    // generate row for subjects, predicate and object
                    var rowString =  "<tr><td>" + results[i].s.value  + "</td><td>" + results[i].p.value + "</td><td>" + results[i].o.value    + "</td></tr>";

                    resultTable.append(rowString);  

                    logger.debug("arrayNode", results[i]);
             };
          });
        };
      });
    });
  };

    buttonQuery.bind("click", runQuery);


  $(document).ready(function() {
     readLocationHash();
     loadFromGitHub();
  });

});
