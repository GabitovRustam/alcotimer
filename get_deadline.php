<?php
    require('lib.php');

    header('Content-Type: application/json');

    $region_code =  $_GET['region'];
    if (empty($region_code)){
        $region_code = 'Moscow';
    }

    list($deadline, $beforeDeadline) = get_deadline($region_code);

    $data = [
        'deadline' => $deadline,
        'beforeDeadline' => $beforeDeadline
    ];

    echo json_encode($data);
?>