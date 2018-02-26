// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

        var map = L.map('map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2
});


L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
  subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
}).addTo(map);

var myURL = jQuery('script[src$="leaf-demo.js"]').attr('src').replace(
  'leaf-demo.js', '');

var myIcon = L.icon({
  iconUrl: myURL + 'images/pin24.png',
  iconRetinaUrl: myURL + 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
});

var marker = new Array();
// Define a callback function to receive the SPARQL JSON result.
function myCallback(str) {
  // Convert result to JSON
  var jsonObj = eval('(' + str + ')');

  for (var i = 0; i < jsonObj.results.bindings.length; i++) {

var LamMarker  = new L.marker([jsonObj.results.bindings[i].lat.value, jsonObj.results.bindings[i]
        .lng.value
      ], {
        icon: myIcon
      })
.bindPopup('<b>'+jsonObj.results.bindings[i].description.value+'</b><br/>');

//.bindPopup('<b>'+jsonObj.results.bindings[i].enterpriseName.value+'</b><br/><p>'+jsonObj.results.bindings[i].ente$
//        '" target="_blank">More info.</a>');

    marker.push(LamMarker);
    map.addLayer(marker[i]);

  }
}


function markerDelAgain() {
for(i=0;i<marker.length;i++) {
    map.removeLayer(marker[i]);
    }  
}

function sparqlQueryJson(queryStr, endpoint, callback, isDebug) {
  var querypart = "query=" + escape(queryStr);

  // Get our HTTP request object.
  var xmlhttp = null;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // Code for older versions of IE, like IE6 and before.
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    alert('Perhaps your browser does not support XMLHttpRequests?');
  }

  // Set up a POST with JSON result format.
  xmlhttp.open('POST', endpoint, true); // GET can have caching probs, so POST
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");

  // Set up callback to get the response asynchronously.
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        // Do something with the results
        callback(xmlhttp.responseText);
      } else {
        // Some kind of error occurred.
        alert("Sparql query error: " + xmlhttp.status + " " + xmlhttp.responseText);
      }
    }
  };
  // Send the query to the endpoint.
  xmlhttp.send(querypart);

  // Done; now just wait for the callback to be called.
};


