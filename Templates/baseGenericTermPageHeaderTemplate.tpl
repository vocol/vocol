<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>{{ entry }}</title>
    <meta name="description" />
    <link rel="stylesheet" type="text/css" href="/docs/style.css" />
    <link href="/docs/prettify.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="/docs/prettify.js"></script>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>

<script type="text/javascript">
      $(document).ready(function(){
        prettyPrint();
        setTimeout(function(){

  $(".atn:contains(itemscope), .atn:contains(itemtype), .atn:contains(itemprop), .atn:contains(itemid), .atn:contains(time), .atn:contains(datetime), .atn:contains(datetime), .tag:contains(time) ").addClass('new');
  $('.new + .pun + .atv').addClass('curl');

        }, 500);
        setTimeout(function(){

  $(".atn:contains(property), .atn:contains(typeof) ").addClass('new');
  $('.new + .pun + .atv').addClass('curl');

        }, 500);
        setTimeout(function() {
          $('.ds-selector-tabs .selectors a').click(function() {
            var $this = $(this);
            var $p = $this.parents('.ds-selector-tabs');
            $('.selected', $p).removeClass('selected');
            $this.addClass('selected');
            $('pre.' + $this.data('selects'), $p).addClass('selected');
          });
        }, 0);
      });
</script>

<style>

  .pln    { color: #444;    } /* plain text                 */
  .tag    { color: #515484; } /* div, span, a, etc          */
  .atn,
  .atv    { color: #314B17; } /* href, datetime             */
  .new    { color: #660003; } /* itemscope, itemtype, etc,. */
  .curl   { color: #080;    } /* new url                    */

  table.definition-table {
    border-spacing: 3px;
    border-collapse: separate;
  }

</style>

</head>
<body class="{{ sitemode }}">

<!--{% include 'basicPageHeader.tpl' with context %} -->

  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/">VocabularyName</a>
      </div>
      <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">

            <li> <a href="/">Home</a> </li>

          </ul>
        </div>
      </div>
    </div>
  </nav>


  <div id="mainContent" class="container" vocab="http://schema.org/" typeof="{{ rdfs_type }}" resource="http://schema.org/{{ entry }}">
  {{ ext_mappings | safe }}


<!-- </div>

</body>
</html> -->
