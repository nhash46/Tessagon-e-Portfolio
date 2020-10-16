<?php
$connection = new MongoClient( "mongodb://localhost:27017/info30005" );
if (!$connection) {
 die("Connection failed: ");
}
?>