<?php
   $json = $_POST['json'];

   /* sanity check */
   if (json_decode($json) != null)
   {
     // Filename where the data will be stored
     $filename = "json/log.json";

     // Open the file in append mode
     $file = fopen($filename, 'a');

     // Write the JSON data followed by a newline for readability
     fwrite($file, $json . PHP_EOL);

     // Close the file
     fclose($file);
   }
   else
   {
     // user has posted invalid JSON, handle the error 
   }
?>
