<?php
echo "<div>aaaabytes written to file</div>";
if(isset($_POST['Validator'])) {
    $data="";
    foreach ($_POST['Validator'] as $select)
    {
      $data +=.$select."\n";
    }
    $ret = file_put_contents('/home/lavdim/Downloads/php/text.txt', $data, FILE_APPEND | LOCK_EX);
    if($ret === false) {
        die('There was an error writing this file');
    }
    else {
        echo "$ret bytes written to file";
    }
}
else {
   die('no post data to process');
}

?>
