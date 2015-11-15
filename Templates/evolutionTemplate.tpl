<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>MobiVoc Vocabulary</title>
  <meta name="description" content="Schema.org is a set of extensible schemas that enables webmasters to embed
    structured data on their web pages for use by search engines and other applications." />
  <link rel="stylesheet" type="text/css" href="/docs/style.css">

  <script type="text/javascript" src="timeline-2.9.1/timeline.js"></script>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="timeline-2.9.1/timeline.css">

  <script type="text/javascript">
    var timeline;
    var data;

    // Called when the Visualization API is loaded.
    function drawVisualization() {

      data = $.parseJSON($.ajax({
        url: "data.json",
        async: false,
        dataType: 'json'
      }).responseText);

      for (var i = 0; i < data.length; i++) {

        data[i]['start'] = new Date(data[i]['start']);

      }

      // specify options
      var options = {
        'width': '100%',
        'height': '300px',
        'style': 'box'
      };

      // Instantiate our timeline object.
      timeline = new links.Timeline(document.getElementById('mytimeline'), options);

      // Draw our timeline with the created data and options
      timeline.draw(data);
    }
  </script>

</head>

<body onload="drawVisualization();">

  {% include 'basicPageHeader.tpl' with context %}

  <div class="container">
    <h3>Evolution Report</h3>
    <div>
      <div id="mytimeline"></div>
      <div> </div>
    </div>
  </div>


  <footer class="footer">
    <div class="container">
      <p class="text-muted">&copy; <a href="http://eis.iai.uni-bonn.de/Projects/VoCol.html">Powered by VoCol</a></p>
    </div>
  </footer>

</body>

</html>
