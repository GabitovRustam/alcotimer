<?php
    // Получение информации по региону
    function get_region_data($region_code)
    {
        require('dbconn.php');

        $conn = new mysqli($DBHost, $DBLogin, $DBPassword, $DBName);
        if($conn->connect_error){
            echo "Ошибка: " . $conn->connect_error;
        }

        $sql = "SELECT * FROM `regions` WHERE code = '" . $region_code . "'";
        if($result = $conn->query($sql)){
            $retval = mysqli_fetch_assoc($result);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }
        $conn->close();   
        return $retval;
    }

?>