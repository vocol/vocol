<!DOCTYPE html>
<html>
  <head>
    <title>VoCol Configuration Page</title>

<!-- include css file here-->
   <link rel="stylesheet" href="css/style.css"/>

  </head>
  <body>
	<div class="container">
		<div class="main">
		<h2>VoCol Configuration Page</h2><hr/>
	    <form method="post" action="form.php">

		<!---------Select Option Fields starts here------>

      <label class="heading">Validation Tool</label><br/><br/>
		  <select name="Validator[]" multiple>
			<option value="Rapper">Rapper</option>
			<option value="RedCat">RdfCat</option>
			<option value="EyeBall">EyeBall</option>
			<option value="OOPS">OOPS Web Service</option>
		  </select><br/><br/>
      <hr/>
      <label class="heading">Documentation Generation Tool</label><br/><br/>
      <select name="DocumentationGeneration[]" multiple>
        <option value="SchemaOrg">SchemaOrg Style</option>
        <option value="LOD">LOD Style</option>
        <option value="Parrot">Parrot Style</option>
        <option value="Option4">Option4</option>
      </select><br/><br/>
      <div>Select Only One Option</div><br/><br/>
      <?php include'select_value.php'; ?>
		 <hr/>

		<!---------Radio Button starts here------>
		 <label class="heading">Radio Buttons :</label><br/>
		  <input type="radio" name="radio" value="Radio 1">Radio 1
		  <input type="radio" name="radio" value="Radio 2">Radio 2<br/>
		  <input type="radio" name="radio" value="Radio 3">Radio 3
		  <input type="radio" name="radio" value="Radio 4">Radio 4<br/><br/>
		  <?php include'radio_value.php'; ?><hr/>
		  <input type="submit" name="submit" value="Save Configuration" />

     </form>
		</div>

		<div class="fugo">
			<a href="http://ok-mobivoc.iais.fraunhofer.de/"><img src="http://www.mobivoc.org/static/img/logo-www.mobivoc.org.png" /></a>
		</div>
   </div>

  </body>
</html>
