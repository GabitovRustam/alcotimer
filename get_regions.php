<?php
    require('lib.php');

    header('Content-Type: application/json');

    $regions = get_regions();

    echo json_encode($regions);
?>