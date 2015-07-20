define(['jquery'], function($) {

  var container = $("#message-queue");

  var messageQueue = [];

  var updateMessageQueue = function () {
    if (messageQueue.length > 0 && Date.now() - messageQueue[0].time >= 5000) {
      messageQueue[0].element.remove();
      messageQueue.shift();
    }
  };

  window.setInterval(updateMessageQueue, 2500);

  var Alert = function (type, description) {
    this.type = type;
    this.description = description;
    this.time = Date.now();
    this.count = 1;

    var classname,
        heading;
    if (type === "error") {
      classname = "alert-danger";
      heading   = "Error"; 
    } else if (type === "warning") {
      classname = "alert-warning";
      heading   = "Warning";
    } else if (type === "info") {
      classname = "alert-info";
      heading   = "Information";
    } else if (type === "success") {
      classname = "alert-success";
      heading   = "Success";
    }

    this.element = $(
      "<div class='alert " + classname  + "' role='alert'>" + 
        "<strong>" + heading + ":</strong> " + description +
      "</div>"
    );
  };
  
  var logConsole = function (type, description, data) {
    if (data) {
      console.log(type + ": " + description, data);
    } else {
      console.log(type + ": " + description);
    }
  };
  
  var logDocument = function (type, description) {
    var alert = new Alert(type, description);

    if (messageQueue.length === 0 || messageQueue[0].type !== type || messageQueue[0].description !== description) {
      container.append(alert.element);
      messageQueue.push(alert);  
    } else {
      messageQueue[0].count++;
      if (messageQueue[0].count === 2) {
        messageQueue[0].element.append("<span class='badge'>2</span>");
      } else {
        messageQueue[0].element.find(".badge").html(messageQueue[0].count);
      }
    }
  };
  
  var error = function (description, data) { 
    logConsole("ERROR", description, data);
    logDocument("error", description);
  };

  var warning = function (description, data) {
    logConsole("Warning", description, data);
    logDocument("warning", description);
  };

  var info = function (description, data) {
    logConsole("Info", description, data);
    logDocument("info", description);
  };

  var success = function (description, data) {
    logConsole("Success", description, data);
    logDocument("success", description);
  };

  var debug = function (description, data) {
    logConsole("Debug", description, data);
  };

  return {
    error: error,
    warning: warning,
    info: info,
    success: success,
    debug: debug
  };  
}); 
