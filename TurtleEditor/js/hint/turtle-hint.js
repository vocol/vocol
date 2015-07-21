// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../lib/codemirror"), require("../mode/turtle/turtle"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../lib/codemirror", "../mode/turtle/turtle"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var WORD = /[\w$]+/g, RANGE = 500;

  var rdfs = ["Class", "Resource", "Property", "Literal", "subClassOf",
              "subPropertyOf", "domain", "range", "Statement",
              "Bag", "Seq", "Alt", "subject", "predicate", "object", "type",
              "value", "Datatype", "langString", "HTML", "XMLLiteral", "label", "comment", "Container", "ContainerMembershipProperty", "member",
              "List", "first", "rest", "nil", "seeAlso", "isDefinedBy", "value"];

  /*
    TODO: Resolve namespaces and only display things in the current namespace
   */

  var getHints = function(editor, options) {console.log("called");
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;


    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);

    var curWord = editor.findWordAt(cur); 
    var s = editor.getRange(curWord.anchor, curWord.head);

    var list = rdfs;

    var suggestions = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].startsWith(s)) {
        suggestions.push(list[i]);
      }
    }



    return {list: suggestions, from: CodeMirror.Pos(cur.line, curWord.anchor.ch), to: CodeMirror.Pos(cur.line, curWord.head.ch)};
  };


  CodeMirror.registerHelper("hint", "turtle", getHints);

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }
});

