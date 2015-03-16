define(['jquery'], function($) {

  var container = $("#logging");
  var logList = null;
  
  var logConsole = function (type, text, data) {
    if (data) {
      console.log(type + ":", text, data);
    } else {
      console.log(type + ":", text);
    }
  }
  
  var logDocument = function (prefix, text, data) {
    var li;

    if (container) {
      if (!logList) {
        container.append("<h1>Messages</h1>");
        logList = $("<ul>");
        container.append(logList);
      }
      li = $("<li>");
      li.append(prefix);
      if (text) {
        $("<span>").text(": " + text).appendTo(li);
      }
      if (data) {
        $("<span>").text(" " + data).appendTo(li);
      }
      logList.append(li);
    }
  }
  
  var error = function (text, data) {
    var type = "<strong>ERROR</strong>"; 
    logConsole("ERROR", text, data);
    logDocument("<strong>ERROR</strong>", text, data);
  };

  var warning = function (text, data) {
    var type = "<em>Warning</em>"; 
    logConsole("Warning", text, data);
    logDocument("<em>Warning</em>", text, data);
  };

  var info = function (text, data) {
    var type = "<span>Info</span>"; 
    logConsole("<span>Info</span>", text, data);
    logDocument("Info", text, data);
  };

  var debug = function (text, data) {
    logConsole("Debug " + text + ":", data);
  };

  var clear = function () {
    container.empty();
    logList = null;
  };

  return {
    error: error,
    warning: warning,
    info: info,
    debug: debug,
    clear: clear
  };
  
}); 
