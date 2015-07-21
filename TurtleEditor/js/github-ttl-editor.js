// see https://www.npmjs.com/package/github-client
// and http://getbootstrap.com/css/ (styles for prettiness)
// and http://codemirror.net/ (text editor with syntax highlighting)
// and https://github.com/RubenVerborgh/N3.js (Turtle parser)
// and https://github.com/antoniogarrote/rdfstore-js (rdfstore for sparql query processing)


define(['jquery', 'github', 'N3', 'lib/codemirror', 'mode/turtle/turtle',
        'logger', 'lib/rdfstore'],


function($, Github, N3, CodeMirror, ModeTurtle, logger, rdfstore) {

  var isBinary = false;

  var gh, repo, branch;
  var fileIsLoaded = false;
  var currentFile;

  var header        = $(".page-header");
  var inputUsername = $("#inputUsername");
  var inputPassword = $("#inputPassword");
  var inputOwner    = $("#inputOwner");
  var inputRepo     = $("#inputRepo");
  var inputBranch   = $("#inputBranch");
  var inputFilename = $("#inputFilename");
  var inputContents = $("#inputContents");
  var sparqlEditor   = $("#sparqlQuery");
  var inputMessage  = $("#inputMessage");
  var buttonLoad    = $("#loadFileButton");
  var buttonSave    = $("#saveFileButton");

  var status        = $("#status");
  var statusIcon    = $("#status-icon");
  var buttonSyntax  = $("#syntaxButton");
  var buttonRunSparql  = $("#buttonRunSparql");
  var selectedFile  = $("#selectFile");
  var resultTable  = $("#resultTable");
  var myTextarea    = inputContents[0];
  var myTestAreaSparql = sparqlEditor[0];

  var editor = CodeMirror.fromTextArea(myTextarea,
                                             { mode: "turtle",
                                               autofocus: false,
                                               lineNumbers: true,
                                               height: 40,
                                               gutters: ["CodeMirror-linenumbers", "breakpoints"]
                                             });
   var sparqlEditor = CodeMirror.fromTextArea(myTestAreaSparql,
                                             { mode: "turtle",
                                               autofocus: false,
                                               lineNumbers: true,
                                                 height: 10,
                                               gutters: ["CodeMirror-linenumbers", "breakpoints"]
                                             });


  var state = {
    syntaxCheck: "pending",
    fileIsLoaded: false
  };



  function makeMarker(errorMessage) {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    marker.title = errorMessage;
    return marker;
  }
         
  var toggleLoadButton = function () {
    buttonLoad.toggleClass("btn-primary");
    buttonLoad.toggleClass("btn-default");
  };

  var toggleSaveButton = function () {
    buttonSave.toggleClass("btn-default");
    buttonSave.toggleClass("btn-danger");
  };
  
  var loadFromGitHub = function () {

    var user;
    var username = inputUsername.val().trim();
    var ownername = inputOwner.val().trim();
    var reponame = inputRepo.val().trim();
    var branchname = inputBranch.val().trim();
    var filename = inputFilename.val().trim();

    //logger.clear();
    if (state.fileIsLoaded) {
      logger.info("File already loaded.");
    } else {
      gh = new Github({
        username: username,
        password: inputPassword.val().trim()
      });

      user = gh.getUser();
      logger.debug("user", user);
    
      if (!user) {
        logger.warning("Not logged in.", username);
      }
      
      repo = gh.getRepo(ownername, reponame);
      branch = repo.getBranch(branchname);
      branch.read(filename, isBinary)
        .done(function(contents) {
          editor.setValue(contents.content);
          state.fileIsLoaded = true;
          toggleLoadButton();
          if (user) {
            toggleSaveButton();
          }
          inputUsername.attr("disabled", "disabled");
          inputPassword.attr("disabled", "disabled");
          inputOwner.attr("disabled", "disabled");
          inputRepo.attr("disabled", "disabled");
          inputBranch.attr("disabled", "disabled");
        //  editor.focus();
        })
        .fail(function(err) {
          logger.error("Read from GitHub failed.", err);
        });
      changeSyntaxCheckState("pending");
       }  
/* =======
     // if (!user) {
     //   logger.warning("NOT logged in: ", username);
      //}
      
      repo = gh.getRepo(ownername, reponame);
      branch = repo.getBranch(branchname);

      var tree = repo.git.getTree("master", null)
              .done(function(tree) 
                {
                     for (var i = 0; i < tree.length; i++) 
                     {
                        if(tree[i].path.endsWith(".ttl"))
                        {
                          var opt = tree[i].path;
                          var el = document.createElement("option");
                          el.textContent = opt;
                          el.value = opt;
                          selectedFile.append(el);
                        }
                      }
                      readFile();
                });
    };
>>>>>>> master-origin */
  };

  var readFile = function()
   {
      file = selectedFile.val()

      branch.read(file, isBinary)
              .done(function(contents) 
               {
                  editor.setValue(contents.content);


                  fileIsLoaded = true;
                  toggleLoadButton();
                  if (user) 
                  {
                    toggleSaveButton();
                  }
                  
                  toggleSyntaxButton();
                  inputUsername.attr("disabled", "disabled");
                  inputPassword.attr("disabled", "disabled");
                  inputOwner.attr("disabled", "disabled");
                  inputRepo.attr("disabled", "disabled");
                  inputBranch.attr("disabled", "disabled");

                })
                .fail(function(err) {
                    logger.error("Read from GitHub failed", err);
                });
      };

  var storeToGitHub = function () {
    var filename = inputFilename.val().trim();
    var content = editor.getValue().trim();
    var message = inputMessage.val().trim();

    if (state.fileIsLoaded) {
      branch.write(filename, content, message, isBinary)
        .done(function() {
          logger.success("Saving to GitHub completed.")
        })
        .fail(function(err) {
          logger.error("Saving to GitHub failed.", err);
        });
    } else {
      logger.info("Nothing to save.");
    }
  };

  var parserHandler = function (error, triple, prefixes) {
      
      if (error) {

        /* extract line Number, only consider the end of the string after "line" */
        var errorSubString = error.message.substr(error.message.indexOf("line")+4);
        var errorLineNumber = parseInt(errorSubString) -1;

        /* add background color, gutter + tooltip */
        editor.getDoc().addLineClass(errorLineNumber, "wrap", "ErrorLine-background");
        editor.setGutterMarker(errorLineNumber, "breakpoints", makeMarker(error.message));

        changeSyntaxCheckState("failed");
      } else if (!triple) {
        changeSyntaxCheckState("passed");      
      }
  };

  var changeSyntaxCheckState = function (newState) {
    if (newState !== state.syntaxCheck) {
      state.syntaxCheck = newState;
      if (newState === "failed") {
        statusIcon.attr("src", "img/red_orb.png").attr("alt", "A red orb.");
        status.html(" Syntax check failed.");
      } else if (newState === "working") {
        statusIcon.attr("src", "img/yellow_orb.png").attr("alt", "A yellow orb.");
        status.html(" Syntax checker working.");
      } else if (newState === "pending") {
        statusIcon.attr("src", "img/yellow_orb.png").attr("alt", "A yellow orb.");
        status.html(" Syntax check pending...");
      } else if (newState === "passed") {
        statusIcon.attr("src", "img/green_orb.png").attr("alt", "A green orb.");
        status.html(" Syntax check passed.");
      }
    }
  }

  var checkSyntax = function () {

    /* remove all previous errores  */
    /* TODO: IMPROVE EFFICIENCY */ 
    editor.eachLine(function(line)
            { editor.getDoc().removeLineClass(line, "wrap");
              editor.clearGutter("breakpoints");}) ;

    var parser, content;
    if (state.fileIsLoaded) {
      content = editor.getValue();
      parser  = N3.Parser();
      parser.parse(content, parserHandler);
    }

  };

  var checkForUpdates = function () {
    if (state.syntaxCheck === "pending") {
      state.syntaxCheck = "working";
      checkSyntax();
    }
  };
  
  buttonLoad.on("click", loadFromGitHub);
  buttonSave.on("click", storeToGitHub);

  editor.on("change", function(cm, o) { changeSyntaxCheckState("pending"); });


   var runQuery = function() {

  //  testString = "@prefix doc: <http://example.org/#ns> . <http://example.org/path> a doc:Document . "

    liveString = editor.getValue();
    queryString = sparqlEditor.getValue();

    // create graph store
	rdfstore.create(function(err, store) {
		store.load("text/turtle", liveString, function(err, results) 
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
	})};

  
  selectedFile.bind("change", readFile);
  buttonRunSparql.bind("click", runQuery);


  // pre-fill some input fields for a quick example
  inputOwner.val("vocol");
  inputRepo.val("mobivoc");
  inputFilename.val("Parking.ttl");
  
  window.setInterval(checkForUpdates, 2000);





// helper function
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

});   