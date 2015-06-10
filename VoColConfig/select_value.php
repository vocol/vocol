<?php
 if(isset($_POST['submit'])){
   $repl  = "# begin_validatora
   python validator/issueGenerator.py -t \"\$GITHUB_TOKEN\" -r \"\$GITHUB_REPOSITORY\" -i \"\$INTERVAL\"

   # generate a new vocabulary version, if it is valid & necessary (=new changes)
   python validator/vocabularyGenerator.py -t \"\$GITHUB_TOKEN\" -r \"\$GITHUB_REPOSITORY\" -i \"\$INTERVAL\"

   # end_validator";

   $fileContent = file_get_contents("/home/lavdim/Downloads/php/VoColJob.sh");

   $patt = "/\# begin_validator([^\]]+)\# end_validator/";
   $res  = preg_replace($patt, $repl, $fileContent);


  if(!empty($_POST['Validator'])) {
	echo "<span>You have selected :</span><br/>";
  $data="";
  foreach ($_POST['Validator'] as $select)
  {
    $data .=$select."\n";
  }
  $ret = file_put_contents('/home/lavdim/Downloads/php/text.txt', $res);
  if($ret === false) {
    die('There was an error writing this file');
  }
  else {
    echo "$ret bytes written to file";
  }
	}
	else { echo "<span>Please Select Atleast One Color.</span><br/>";}
}
	?>
