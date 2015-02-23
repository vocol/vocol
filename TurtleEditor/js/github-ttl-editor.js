// see https://www.npmjs.com/package/github-client
// and http://getbootstrap.com/css/ (styles for prettiness)
// and http://codemirror.net/ (text editor with syntax highlighting)

define(['jquery', 'github', 'N3', 'lib/codemirror', 'mode/turtle/turtle',
        'logger'],
function($, Github, N3, CodeMirror, ModeTurtle, logger) {

  var isBinary = false;

  var gh, repo, branch;
  var fileIsLoaded = false;

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
                                               lineNumbers: true
                                             });
         
  var toggleLoadButton = function () {
    buttonLoad.toggleClass("btn-primary");
    buttonLoad.toggleClass("btn-default");
  };

  var toggleSaveButton = function () {
    buttonSave.toggleClass("btn-default");
    buttonSave.toggleClass("btn-danger");
  };

  var toggleSyntaxButton = function () {
    buttonSyntax.toggleClass("btn-default");
    buttonSyntax.toggleClass("btn-primary");
  };

  var successSignal = function () {
    header.toggleClass("bg-success");
    window.setTimeout(function () {
      header.toggleClass("bg-success");           
    }, 1500);
  };
  
  var loadFromGitHub = function () {
    var user;
    var username = inputUsername.val().trim();
    var ownername = inputOwner.val().trim();
    var reponame = inputRepo.val().trim();
    var branchname = inputBranch.val().trim();
    var filename = inputFilename.val().trim();
    logger.clear();
    if (fileIsLoaded) {
      alert("File already loaded!");
    } else {
      gh = new Github({
        username: username,
        password: inputPassword.val().trim()
      });

      user = gh.getUser();
      logger.debug("user", user);
      if (!user) {
        logger.warning("NOT logged in: ", username);
      }
      
      repo = gh.getRepo(ownername, reponame);
      branch = repo.getBranch(branchname);
      branch.read(filename, isBinary)
        .done(function(contents) {
          editor.setValue(contents.content);
          fileIsLoaded = true;
          toggleLoadButton();
          if (user) {
            toggleSaveButton();
          }
          toggleSyntaxButton();
          inputUsername.attr("disabled", "disabled");
          inputPassword.attr("disabled", "disabled");
          inputOwner.attr("disabled", "disabled");
          inputRepo.attr("disabled", "disabled");
          inputBranch.attr("disabled", "disabled");
          editor.focus();
        })
        .fail(function(err) {
          logger.error("Read from GitHub failed", err);
        });
    }
  };
  
  var storeToGitHub = function () {
    var filename = inputFilename.val().trim();
    var content = editor.getValue().trim();
    var message = inputMessage.val().trim();
    logger.clear();
    if (fileIsLoaded) {
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
  }

  var parserHandler = function (error, triple, prefixes) {
      if (error) {
        logger.error(null, error.message);
        editor.focus();
        editor.setCursor({line: (error.line || 1) - 1, ch: 0});

      } else if (!triple) {
        successSignal();
      }
    }

  var checkSyntax = function () {
    var parser, content;
    logger.clear();
    if (fileIsLoaded) {
      content= editor.getValue();
      parser = N3.Parser();
      parser.parse(content, parserHandler);
    }
  }
  
  buttonLoad.bind("click", loadFromGitHub);
  buttonSave.bind("click", storeToGitHub);
  buttonSyntax.bind("click", checkSyntax);

  // pre-fill some input fields for a quick example
  inputOwner.val("mobivoc");
  inputRepo.val("mobivoc");
  inputFilename.val("Parking.ttl");
  
});
