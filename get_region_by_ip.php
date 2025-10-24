<?php
    require('lib.php');
    require('dadataconf.php');

    header('Content-Type: application/json');

    function getIp() {
    $keys = [
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'REMOTE_ADDR'
    ];
    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
        $ip = trim(end(explode(',', $_SERVER[$key])));
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
        }
    }
    }

    $ip = getIp();

    $url = "iplocate/address";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
                                               'Accept: application/json',
                                               'Authorization: Token ' . $token));
    curl_setopt($ch, CURLOPT_URL,'https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip='.$ip);
    $json = curl_exec($ch);
    $result = json_decode($json);
    $region_code = get_region_code_by_kladr(substr($result->location->data->region_kladr_id, 0, 2));
    $data = [
        'region_code' => $region_code
    ];
    echo json_encode($data);
?>