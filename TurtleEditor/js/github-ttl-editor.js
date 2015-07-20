// see https://www.npmjs.com/package/github-client
// and http://getbootstrap.com/css/ (styles for prettiness)
// and http://codemirror.net/ (text editor with syntax highlighting)
// and https://github.com/RubenVerborgh/N3.js (Turtle parser)


define(['jquery', 'github', 'N3', 'lib/codemirror', 'mode/turtle/turtle',
        'logger'],


function($, Github, N3, CodeMirror, ModeTurtle, logger) {

  var isBinary = false;

  var gh, repo, branch;

  var header        = $(".page-header");
  var inputUsername = $("#inputUsername");
  var inputPassword = $("#inputPassword");
  var inputOwner    = $("#inputOwner");
  var inputRepo     = $("#inputRepo");
  var inputBranch   = $("#inputBranch");
  var inputFilename = $("#inputFilename");
  var inputContents = $("#inputContents");
  var inputMessage  = $("#inputMessage");
  var buttonLoad    = $("#loadFileButton");
  var buttonSave    = $("#saveFileButton");
  var buttonSyntax  = $("#syntaxButton");

  var myTextarea = inputContents[0];
  var editor = CodeMirror.fromTextArea(myTextarea,
                                             { mode: "turtle",
                                               autofocus: false,
                                               lineNumbers: true,
                                               gutters: ["CodeMirror-linenumbers", "breakpoints"]
                                             });
  var wasChanged = false;

  var state = {
    syntaxCheck: "pending", // can be one of "passed", "pending" or "failed"
    fileIsLoaded: false
  };


  editor.on("change", function(cm, o) { wasChanged = true; syntaxCheck = "pending"; });

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
      logger.info("File already loaded!");
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
          logger.error("Read from GitHub failed", err);
        });
    }
    wasChanged = true;
  };
  
  var storeToGitHub = function () {
    var filename = inputFilename.val().trim();
    var content = editor.getValue().trim();
    var message = inputMessage.val().trim();
    logger.clear();
    if (state.fileIsLoaded) {
      branch.write(filename, content, message, isBinary)
        .done(function() {
          successSignal();
        })
        .fail(function(err) {
          logger.error("Saving to GitHub failed", err);
        });
    } else {
      alert("Nothing to save!");
    }
  };

  var parserHandler = function (error, triple, prefixes) {
      
  /*    logger.debug(null, error); */
      if (error) {


     //   logger.error(null, error.message);
     //   editor.focus();
        /* editor.setCursor({line: (error.line || 1) - 1, ch: 0});   */

        /* extract line Number, only consider the end of the string after "line" */
        var errorSubString = error.message.substr(error.message.indexOf("line")+4);
        var errorLineNumber = parseInt(errorSubString) -1;

        /* set cursor */
     //   editor.setCursor(errorLineNumber);

        /* add background color, gutter + tooltip*/
        editor.getDoc().addLineClass(errorLineNumber, "wrap", "ErrorLine-background");
        editor.setGutterMarker(errorLineNumber, "breakpoints", makeMarker(error.message));

      } else if (!triple) {
        //successSignal();
        logger.success("No errors found.");
      }
    };

  var checkSyntax = function () {

    /* remove all previous errors */ 
    editor.eachLine(function(line)
            { editor.getDoc().removeLineClass(line, "wrap");
              editor.clearGutter("breakpoints");}) ;

    var parser, content;
    if (state.fileIsLoaded) {
      content= editor.getValue();
      parser = N3.Parser();
      parser.parse(content, parserHandler);
    }
  };

  var checkForUpdates = function () {
    if (wasChanged) {
      wasChanged = false;
      checkSyntax();
    }
  };
  
  buttonLoad.on("click", loadFromGitHub);
  buttonSave.on("click", storeToGitHub);
  buttonSyntax.on("click", checkSyntax);

  // pre-fill some input fields for a quick example
  inputOwner.val("vocol");
  inputRepo.val("mobivoc");
  inputFilename.val("Parking.ttl");
  
  window.setInterval(checkForUpdates, 3000);
});
