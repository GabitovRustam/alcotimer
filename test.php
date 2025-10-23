<?php
require('lib.php');

echo "<br />get_deadline test start <br />";

list($deadline, $beforeDeadline) = get_deadline("Daghestan");
var_dump($deadline);
var_dump($beforeDeadline);

echo " <br />get_deadline test end<br />";

echo "<br />get_region_data test start <br />";

$region_data = get_region_data("Daghestan");
var_dump($region_data);

echo " <br />get_region_data test end<br />";

echo "<br />get_regions test start <br />";

$regions = get_regions();
var_dump($regions);

echo " <br />get_regions test end<br />";
?>