<?php
echo "test start <br />";

require('lib.php');
$row = get_region_data("Daghestan");
var_dump($row);

echo " <br />test end";
?>