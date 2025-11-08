<?php
require('lib.php');

echo "<br />get_ban_dates test start <br />";

$banDates = get_ban_dates('Bashkortostan');
echo "<pre>"; 
var_dump($banDates);
echo "</pre>";

echo " <br />get_ban_dates test end<br />";


?>