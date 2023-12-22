<?php
   $json = file_get_contents('php://input');

   // Check if any data is received
   if (!$json) {
       die("No data received");
   }

   // Try to decode the JSON data
   $data = json_decode($json);
   if (!$data) {
       die("Invalid JSON data");
   }

   // Define the file path
   $filename = "json/log.json";

   // Try to open the file
   if (!$file = fopen($filename, 'a')) {
       die("Unable to open file");
   }

   // Try to write to the file
   if (fwrite($file, $json . PHP_EOL) === FALSE) {
       fclose($file);
       die("Unable to write to file");
   }

   // Close the file
   fclose($file);

   echo "Data written successfully";
?>
