<!-- Header start from basicPageHeader.tpl -->
<nav class="navbar navbar-inverse navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="/">MobiVoc VocabularyNew</a>
		</div>
		<div id="navbar" class="collapse navbar-collapse">
			<ul class="nav navbar-nav">

				<!--<li><a href="/">Home</a> </li>-->

				{% if menu_sel == "Home" %} <li class="activelink"> {% else %} <li> {% endif %} <a href="/">Home</a> </li>

				<!--Schema {% if menu_sel == "Documentation" %}<li class="activelink">{% else %}<li>{% endif %}<a href="/docs/schemas.html">Documentation</a></li> Schema-->

				 {% if menu_sel == "Documentation" %}<li class="activelink">{% else %}<li>{% endif %}<a href="/docs/Widoco/widocoGen/index.html">Documentation</a></li> 

				 {% if menu_sel == "Visualization" %} <li class="activelink"> {% else %} <li> {% endif %} <a href="/docs/webvowl/index.html">Visualization</a> </li> 

				 {% if menu_sel == "Sparql" %} <li class="activelink"> {% else %} <li> {% endif %} <a href="/docs/sparql.html">Sparql</a> </li> 

				 {% if menu_sel == "Syntax Validation" %} <li class="activelink"> {% else %} <li> {% endif %} <a href="/docs/syntax_validation.html">Syntax Validation Report</a> </li> 

				 {% if menu_sel == "Evolution Report" %} <li class="activelink"> {% else %} <li> {% endif %} <a href="/docs/evolution.html">Evolution Report</a> </li> 

                                 {% if menu_sel == "Other Branches" %} <li class="activelink"> {% else %} <li> {% endif %} <a href="/docs/otherBranches.html">Other Branches</a> </li> 

			</ul>
		</div>
	</div>
	</div>
</nav>


<!-- Header end from basicPageHeader.tpl -->
