<?php
    require('lib.php');

    header('Content-Type: application/json');

    $regions = get_regions();
    
    $allregions = [];
    foreach ($regions as $region) {
        list($deadline, $beforeDeadline) = get_deadline($region['code']);
        $newregion = [];
        $newregion['code'] = $region['code'];
        $newregion['name'] = $region['name'];
        $newregion['svg'] = $region['svg'];
        $newregion['deadline'] = $deadline;
        $newregion['beforeDeadline'] = $beforeDeadline;
        array_push($allregions, $newregion);
    }


    echo json_encode($allregions);
?>