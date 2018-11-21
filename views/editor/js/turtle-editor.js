// see https://www.npmjs.com/package/github-client
// and http://getbootstrap.com/css/ (styles for prettiness)
// and http://codemirror.net/ (text editor with syntax highlighting)
// and https://github.com/RubenVerborgh/N3.js (Turtle parser)


define(['jquery', 'github', 'N3', 'lib/codemirror',
  'addon/hint/show-hint', 'mode/turtle/turtle', 'hint/turtle-hint',
  'logger', 'addon/search/search', 'addon/search/searchcursor',
  'addon/selection/mark-selection', 'semanticUI/semantic'
],

  function($, Github, N3, CodeMirror, ShowHint, ModeTurtle, HintTurtle,
    logger, Search, SearchCursor, MarkSelection, SemanticUI) {

    // HTML elements ------------------------------------------------------------

    var menu = $("#menu");

    var inputElements = {
      username: $("#input-username"),
      password: $("#input-password"),
      file: $("#input-file"),
      contents: $("#input-contents"),
      message: $("#input-message"),
      load: $("#button-load"),
      save: $("#button-save"),
      fileDisp: $(".current-filename"),
      vowlLink: $("#webvowl-link"),
      ghLink: $("#github-link"),
      sparqlURL: $("#sparql-link"),
      search: $("#search-input")
    };

    var syntaxCheckElements = {
      checker: $("#syntax-check"),
      working: $("#syntax-check-working"),
      pending: $("#syntax-check-pending"),
      passed: $("#syntax-check-passed"),
      failed: $("#syntax-check-failed"),
      off: $("#syntax-check-off")
    };

    // Editor state -------------------------------------------------------------

    var isBinary = false;

    var gh,
      repo,
      branch,
      user;
    var currentFile;
    var currentRepoOwner = "",
      currentRepoName = "",
      currentRepoBranch = "",
      currentCommit = "";
    initialCommit = "";
    // get some repo. information four userConfigurations.json file to be used in this editor
      (function setRepoInfo() {
        $.ajax({
          type: "GET",
          url: document.URL.split("turtleEditorLink")[0] + "getRepoInfo",
          headers: {
            Accept: 'application/json;charset=UTF-8'
          },
          success: function(data, textStatus, jqXHR) {
            if (data) {
              currentRepoOwner = data[0];
              currentRepoName = data[1];
              currentRepoBranch = data[2];
            }
          },
        });
      })() 

    var state = {
      syntaxCheck: "off",
      fileIsLoaded: false,
      gh: undefined,
      repo: undefined,
      branch: undefined,
      user: undefined,
      currentFile: undefined
    };

    var activationState = true;

    var editor = CodeMirror.fromTextArea(inputElements.contents[0], {
      mode: "turtle",
      autofocus: false,
      lineNumbers: true,
      gutters: ["CodeMirror-linenumbers", "breakpoints"],
      extraKeys: {
        "Ctrl-Space": "autocomplete"
      }
    });

    // Initialization -----------------------------------------------------------
    editor.custom = {}; // to pass list of prefixes and names
    editor.custom.dynamicNames = {};
    editor.custom.prefixed = {};
    var dynamicNames = {};

    CodeMirror.commands.autocomplete = function(cm) {
      cm.showHint(cm, CodeMirror.hint.turtle, {
        test: "test"
      });
    };

    //Further information to help User-------------------------------------------

    $('.popup-show')
      .popup({
        inline: true,
        position: 'bottom left'
      });

    $('.popup-click-show')
      .popup({
        popup: $('.custom.popup'),
        on: 'click',
        inline: true,
        position: 'bottom left'
      });
    // @ahmed
    // when help button is clicked
    $('#helpModal').modal('attach events', '#helpButton',
      'show');

    // Reenable input element (necessary for Firefox)
    for (var key in inputElements) {
      inputElements[key].prop("disabled", false);
    }

    // Github Interaction -------------------------------------------------------
    var loadFromGitHub = function() {
      var username = inputElements.username.val().trim();
      var ownername = currentRepoOwner;
      var password = inputElements.password.val().trim();
      var reponame = currentRepoName;
      var branchname = currentRepoBranch;
      $('#search-input').attr('enabled', true);
      enableSearchButton();

      if (state.fileIsLoaded) {
        logger.info("File already loaded.");
      } else {
        if (username != "") {
          gh = new Github({
            username: username,
            password: password
          });
        } else {
          gh = new Github({
            token: password
          });
        }

        user = gh.getUser();
        logger.debug("user", user);

        if (!user) {
          logger.warning("Not logged in.", username);
        }

        repo = gh.getRepo(ownername, reponame);
        branch = repo.getBranch(branchname);

        // TODO:
        // the next call is redundant: branch already contains list of files,
        // and this should not be "master" but the selected branch:
        var tree = repo.git.getTree("master", null)
          .done(function(tree) {
            for (var i = 0; i < tree.length; i++) {
              if (tree[i].path.endsWith(".ttl")) {
                var opt = tree[i].path;
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                inputElements.file.append(el);
              }
            }
            readFile();
          });
      //@ahmed
      // stop disabling username and  password
      //inputElements.username.prop("disabled", true);
      //inputElements.password.prop("disabled", true);
      // @ahmed
      //  disableLoadButton();
      //changeSyntaxCheckState("pending");
      }


      //Show new commit on github------------------------------------------------
      $.ajax({ //Initializing commit with last commit of repo by loading file
        type: 'GET',
        url: "https://api.github.com/repos/" + currentRepoOwner + "/" +
          currentRepoName +
          "/commits?Accept=application/vnd.github.v3+json",

        data: {
          get_param: 'value'
        },
        success: function(data) {
          initialCommit = currentCommit = data[0]['sha']; //Get commit's sha
          console.log(data[0]['sha']);
        }
      });

    };
    //------------------------------------------------------------------------



    var readFile = function() {
      var filename = inputElements.file.val()
      // when change the file hide these elements and clear searched text
      $("#search-count").hide();
      $("#next-btn").hide();
      $("#previous-btn").hide();
      $("#search-input").val("");

      branch.read(filename, isBinary)
        .done(function(contents) {
          editor.setValue(contents.content);
          state.fileIsLoaded = true;
          displayCurrentFilename(filename);

          if (user) {
            enableSaveButton();
          }

          localStorage.setItem("someVarKey", editor.getValue());
        })
        .fail(function(err) {
          logger.error("Read from GitHub failed", err);
        });

    //changeSyntaxCheckState("pending");
    };

    var storeToGitHub = function() {
      //New commit on repository is checked
      if (initialCommit != currentCommit) { //Check if currentCommit is not the same as initial commit, will show the modal message.
        $('#modalNewCommit').modal({
          centered: false,
          blurring: true
        }).modal('show');
      }

      document.getElementById("enableDisbleSyntaxChecking").checked = true;
      $('.ui.toggle').checkbox();
      console.log("Changing"); //make alarm in the case of new commit has come
      changeSyntaxCheckState("pending");

      var filename = inputElements.file.val();
      var content = editor.getValue().trim();
      var message = inputElements.message.val().trim();
      if (message) {
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
      } else {
        alert(
          "Please, fill-in the commit message box, it cannot be empty..."
        );
      }
    };

    // Display current filename -------------------------------------------------
    var displayCurrentFilename = function(filename) {
      var baseUri = "http://vowl.visualdataweb.org/webvowl/index.html#iri=https://raw.githubusercontent.com/";
      var ownername = currentRepoOwner;
      var reponame = currentRepoName;
      var branchname = currentRepoBranch;
      var specific = ownername + "/" + reponame + "/" + branchname;
      inputElements.fileDisp.html(filename)
      inputElements.vowlLink.removeAttr("href");
      inputElements.vowlLink.attr("href", baseUri + specific + "/" +
        filename);

      // external links //////////////////////////
      var githubURI = "https://github.com";
      inputElements.ghLink.attr("href", githubURI + "/" + ownername + "/" +
        reponame + "/");
      var sparqlProcessorURI = "../SparqlProcessor/sparql-processor.html";

      inputElements.sparqlURL.attr("href", sparqlProcessorURI + "#" +
        ownername + "/" + reponame + "/" + filename);
      $("#menu").show();
    };

    // "http://vowl.visualdataweb.org/webvowl/index.html#iri=https://raw.githubusercontent.com/mobivoc/mobivoc/master/"

    editor.on("change", function() {
      setInterval(function() { //In every 60 seconds get last commit of repo and compare it with current commit of user
        $.ajax({
          type: 'GET',
          url: "https://api.github.com/repos/" + currentRepoOwner +
            "/" +
            currentRepoName +
            "/commits?Accept=application/vnd.github.v3+json",
          data: {
            get_param: 'value'
          },

          //Change the success function to logger
          success: function(data) {

            //Add it in commit button
            if (data[0]['sha'] != currentCommit) {
              logger.warning(
                "New commit happened on your working repository"
              );
              currentCommit = data[0]['sha'];
            }
          }
        });
      }, 300000);


      if (editor.getValue() != localStorage.getItem("someVarKey") &&
        activationState) {
        document.getElementById("enableDisbleSyntaxChecking").checked = true;
        $('.ui.toggle').checkbox();
        console.log("Changing"); //make alarm in the case of new commit has come
        changeSyntaxCheckState("pending");
      }
    });

    // Syntax Check -------------------------------------------------------------
    // Search in textArea--------------------------------------------------------
    var marked = [],
      markedPositions = [],
      lastPos = null,
      lastQuery = null;

    function unmark() {
      for (var i = 0; i < markedPositions.length; ++i) markedPositions[i].clear();
      markedPositions.length = 0; //editor clear selected cursor positions
      for (var i = 0; i < marked.length; ++i) marked[i].clear();
      marked.length = 0; //editor clear searched texts
    }

    function search(select) {
      var currentIndex = 0;

      function setPosition() {
        editor.setSelection(marked[currentIndex].find()['from'],
          marked[currentIndex].find()['to']);
        editor.setCursor(marked[currentIndex].find()['from']);

        if (markedPositions.length != 0) {
          markedPositions[0].clear();
          markedPositions.pop();
        }

        markedPositions.push(editor.markText(marked[currentIndex].find()[
          'from'],
            marked[
              currentIndex].find()['to'], {
              css: "background-color: orange"
            }));
        var actualIndexValue = currentIndex + 1;
        document.getElementById('search-index').innerHTML = actualIndexValue.toString() +
          '/';
      }

      function select() { //This function change the position of cursor by click on buttons.
        if (marked.length != 0) {

          $('#previous-btn').on("click", function() {
            if (currentIndex == 0) {
              currentIndex = marked.length - 1;
            } else {
              currentIndex--;
            }

            setPosition();
          });

          $('#next-btn').on("click", function() {
            if (currentIndex == marked.length - 1) {
              currentIndex = 0;
            } else {
              currentIndex++;
            }

            setPosition();
          });
        }
      }

      unmark();
      var text = document.getElementById("search-input").value;
      if (this.value != '') {
        for (var cursor = editor.getSearchCursor(text); cursor.findNext();) {
          marked.push(editor.markText(cursor.from(), cursor.to(), {
            className: "searched-key",
            clearOnEnter: true
          }));
        //  markedPositions.push(marked[marked.length-1]);
        }
        document.getElementById('search-index').innerHTML = '0/'; //change to 1?
        document.getElementById('search-total').innerHTML = marked.length;
        document.getElementById('search-count').style.display = 'inline-block';
        document.getElementById('next-btn').style.display = 'inline-block';
        document.getElementById('previous-btn').style.display = 'inline-block';
        select();
      } else {
        unmark();
        $("#search-count").hide();
        $("#next-btn").hide();
        $("#previous-btn").hide();
      }
    }

    $('#search-input').on("input", search);

    //Check the new commit and popup it--------------------------------------------------
    //-----------------------------------------------------------------------------

    var playChecking = function() {
      console.log("playChecking");
      $('.ui.toggle').checkbox();
      activationState = true;
      if (state.syntaxCheck === "off") {
        console.log("-> pending");
        changeSyntaxCheckState("pending", undefined, true);
      }
    };

    var pauseChecking = function() {
      activationState = false;
      if (state.syntaxCheck !== "off") {
        changeSyntaxCheckState("off");
        console.log("-> off");
      }
    };
    // enable checkbox function


    $('.ui.toggle').click(function() {
      if (!$('#enableDisbleSyntaxChecking').is(":checked")) {
        playChecking();
      } else {

        pauseChecking();
      }
    });

    var makeMarker = function(errorMessage) {
      var marker = document.createElement("div");
      marker.style.color = "#822";
      marker.innerHTML = "●";
      marker.title = errorMessage;
      return marker;
    };

    var splitIntoNamespaceAndName = function(s) {
      var lastHash = s.lastIndexOf("#");
      var lastSlash = s.lastIndexOf("/");
      var pos = Math.max(lastHash, lastSlash) + 1;

      return {
        namespace: s.substring(0, pos),
        name: s.substring(pos)
      };
    };

    var parserHandler = function(error, triple, prefixes) {
      if (error) {
        /* extract line Number, only consider the end of the string after "line" */
        var errorSubString = error.message.substr(error.message.indexOf(
            "line") + 4);
        var errorLineNumber = parseInt(errorSubString) - 1;
        //TODO: check what is going here
        // /* add background color, gutter + tooltip */
        // var lastPos = null,
        //   lastQuery = null,
        //   marked = [];
        // var text = this.value;
        // for (var cursor = editor.getSearchCursor(text); cursor.findNext();)
        //   marked.push(editor.markText(cursor.from(), cursor.to(), {
        //     className: "styled-background"
        //   }));
        // if (lastQuery != text)
        //   lastPos = null;
        // var cursor = editor.getSearchCursor(text, lastPos || editor.getCursor());
        // if (!cursor.findNext()) {
        //   cursor = editor.getSearchCursor(text);
        // }
        // editor.setSelection(cursor.from(), cursor.to());
        // lastQuery = text;
        // lastPos = cursor.to();
        editor.getDoc().addLineClass(errorLineNumber, "wrap",
          "ErrorLine-background");
        editor.setGutterMarker(errorLineNumber, "breakpoints", makeMarker(
          error.message));

        changeSyntaxCheckState("failed", error.message);
      } else if (triple) {
        var subjectSplit = splitIntoNamespaceAndName(triple.subject);
        var predicateSplit = splitIntoNamespaceAndName(triple.predicate);
        var objectSplit = splitIntoNamespaceAndName(triple.object);

        dynamicNames[subjectSplit.namespace] = dynamicNames[subjectSplit.namespace] || {};
        dynamicNames[subjectSplit.namespace][subjectSplit.name] = true;

        dynamicNames[predicateSplit.namespace] = dynamicNames[
          predicateSplit.namespace] || {};
        dynamicNames[predicateSplit.namespace][predicateSplit.name] = true;

        dynamicNames[objectSplit.namespace] = dynamicNames[objectSplit.namespace] || {};
        dynamicNames[objectSplit.namespace][objectSplit.name] = true;
      } else if (!triple) {
        changeSyntaxCheckState("passed");
        editor.custom.dynamicNames = dynamicNames;
      }

      if (prefixes) {
        editor.custom.prefixes = prefixes;
      }
    };

    var changeSyntaxCheckState = function(newState, error, force = false) {
      if (newState !== state.syntaxCheck && (state.syntaxCheck !== "off" ||
        force === true)) {
        console.log("changeSyntaxCheckState", newState, error, force);
        syntaxCheckElements[state.syntaxCheck].hide();
        state.syntaxCheck = newState;

        if (newState === "failed") {
          var status = syntaxCheckElements[newState].find(".status")
          if (error) {
            if (error.startsWith("Syntax error:")) {
              status.html(" " + error);
            } else {
              status.html(" Syntax error: " + error);
            }
          } else {
            status.html(" Syntax check failed.")
          }
        }
        syntaxCheckElements[newState].show();
      }
    };

    var checkSyntax = function() {
      /* remove all previous errors  */
      /* TODO: IMPROVE EFFICIENCY */
      editor.eachLine(function(line) {
        editor.getDoc().removeLineClass(line, "wrap");
        editor.clearGutter("breakpoints");
      });

      var parser,
        content;
      if (state.fileIsLoaded) {
        content = editor.getValue();
        parser = N3.Parser();
        parser.parse(content, parserHandler);
      }
    };

    var checkForUpdates = function() {
      if (state.syntaxCheck === "pending" && state.fileIsLoaded &&
        activationState) {
        changeSyntaxCheckState("working");
        checkSyntax();
      }
    };

    // Event listeners ----------------------------------------------------------
    inputElements.load.on("click", loadFromGitHub);
    inputElements.save.on("click", storeToGitHub);
    inputElements.file.on("change", readFile);

    // Repeated actions ---------------------------------------------------------
    window.setInterval(checkForUpdates, 1000);

    // Utility ------------------------------------------------------------------
    var disableLoadButton = function() {
      inputElements.load.removeClass("btn-primary");
      inputElements.load.addClass("btn-default");
      inputElements.load.prop("disabled", true);
    };

    var enableSaveButton = function() {
      inputElements.save.removeClass("btn-default");
      inputElements.save.addClass("btn-primary");
      inputElements.save.prop("disabled", false);
    };

    var disableSaveButton = function() {
      inputElements.save.addClass("btn-default");
      inputElements.save.removeClass("btn-primary");
      inputElements.save.prop("disabled", true);
    };

    var enableSearchButton = function() {
      inputElements.search.prop("disabled", false);
    };

    var disableSearchButton = function() {
      inputElements.search.prop("disabled", true);
    };

    // do it
    disableSaveButton();
    disableSearchButton();
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
          position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      };
    }

    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      };
    }
  });
