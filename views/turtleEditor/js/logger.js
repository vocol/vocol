define(['jquery'], function($) {

  var container = $("#message-queue");

  var messageQueue = [];

  var updateMessageQueue = function () {
    if (messageQueue.length > 0 && Date.now() - messageQueue[0].time >= 10000) {
      messageQueue[0].element.fadeOut("slow", function() {
        this.remove();
      });
      messageQueue.shift();
      if (messageQueue.length >= 3) {
        messageQueue[2].element.show();
      }
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
      heading   = "Info";
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
    var len  = messageQueue.length;
    var last = messageQueue[len - 1];

    if (len === 0 || last.type !== type || last.description !== description) {
      var alert = new Alert(type, description);
      container.append(alert.element).hide().fadeIn("fast");
      messageQueue.push(alert);
      if (len >= 3) {
        alert.element.hide();
      }
    } else {
      last.count++;
      last.time = Date.now();
      if (last.count === 2) {
        last.element.append(" <span class='badge'>2</span>");
      } else {
        last.element.find(".badge").html(messageQueue[len - 1].count);
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
