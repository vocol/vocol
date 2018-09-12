// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../lib/codemirror"), require("../mode/turtle/turtle"), require("../lib/n3-browser-slk"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../lib/codemirror", "../mode/turtle/turtle", "N3"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var staticNames = {
    "http://www.w3.org/2000/01/rdf-schema#": [ // rdfs
      "Alt", "Bag", "Class",
      "Container", "ContainerMembershipProperty", "Datatype",
      "HTML", "List", "Literal", "Property",
      "Resource", "Seq", "Statement",
      "XMLLiteral", "comment", "domain",
      "first", "isDefinedBy", "label",
      "langString", "member", "nil",
      "object", "predicate", "range",
      "rest", "seeAlso", "subClassOf",
      "subject", "subPropertyOf", "type",
      "value",
    ]
  };

  var getHints = function(editor, options) {
    var cursor  = editor.getCursor();
    var curLine = editor.getLine(cursor.line);
    var curWord = getWordAt(curLine, cursor.ch);
    var s       = curWord.s;
    var parts = s.split(":");
    var prefix = parts[0];
    var name   = parts[1];

    var suggestions;

    if (typeof name === "undefined") { // suggest prefixes
      var prefixes = Object.keys(editor.custom.prefixes);
      prefixes = prefixes.filter(function (e) {
        return e.startsWith(prefix);
      });

      suggestions = [];
      for (var i = 0, len = prefixes.length; i < len; i++) {
        var namespace = editor.custom.prefixes[prefixes[i]];
        var names = staticNames[namespace] || (editor.custom.dynamicNames[namespace] && Object.keys(editor.custom.dynamicNames[namespace])) || [];
        names = names.map(function (s) {
          return prefixes[i] + ":" + s;
        });
        suggestions = suggestions.concat(names);
      }

      return {
        list: suggestions,
        from: CodeMirror.Pos(cursor.line, curWord.left),
        to: CodeMirror.Pos(cursor.line, curWord.right)
      };
    } else { // suggest names
      var namespace = editor.custom.prefixes[prefix];
      suggestions   = staticNames[namespace] || (editor.custom.dynamicNames[namespace] && Object.keys(editor.custom.dynamicNames[namespace])) || [];
      suggestions   = suggestions.filter(function (e) {
        return e.startsWith(name);
      });
      return {
        list: suggestions,
        from: CodeMirror.Pos(cursor.line, curWord.left + prefix.length + 1),
        to: CodeMirror.Pos(cursor.line, curWord.right)
      };
    }
  };

  CodeMirror.registerHelper("hint", "turtle", getHints);


  // Utility ------------------------------------------------------------------
  
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }

  function getWordAt(str, pos) {

    // Find beginning
    var left = Math.max(str.slice(0, pos + 1).search(/\S+$/), str.slice(0, pos).search(/\S+$/));
    if (left === -1) {
      return {
        s: "", left: pos, right: pos
      };
    }

    // Find end
    var right = str.slice(pos).search(/\s/);
    if (right === -1) {
      right = str.length;
    } else {
      right += pos
    }

    return {
      s: str.slice(left, right),
      left: left,
      right: right
    };
  }
});

