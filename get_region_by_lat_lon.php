<?php
    require('lib.php');
    require('dadataconf.php');

    header('Content-Type: application/json');

    $lat = $_GET['lat'];
    $lon = $_GET['lon'];

    $url = "iplocate/address";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
                                               'Accept: application/json',
                                               'Authorization: Token ' . $token));
    curl_setopt($ch, CURLOPT_URL,'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address');
    curl_setopt($ch, CURLOPT_POSTFIELDS, '{"lat": '.$lat.', "lon": '.$lon.'}');
    $json = curl_exec($ch);
    $result = json_decode($json);
    $region_code = get_region_code_by_kladr(substr($result->suggestions[0]->data->region_kladr_id, 0, 2));
    $data = [
        'region_code' => $region_code
    ];
    echo json_encode($data);
?>