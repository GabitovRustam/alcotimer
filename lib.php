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

    // Получение списка регионов
    function get_regions()
    {
        require('dbconn.php');

        $conn = new mysqli($DBHost, $DBLogin, $DBPassword, $DBName);
        if($conn->connect_error){
            echo "Ошибка: " . $conn->connect_error;
        }

        $sql = "SELECT code, `name` FROM `regions` order by `name`";
        if($result = $conn->query($sql)){
            $retval = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }
        $conn->close();   
        return $retval;
    }

    // Функция получения времени по региону в utc
    function get_deadline($region_code) {
        // Время по умолчанию
        $timezone = 3;
        $end_hour = 23;
        $start_hour = 8;
        $timezoneName = timezone_name_from_abbr("", $timezone*3600, false);
        $date = new DateTime('now', new DateTimeZone($timezoneName));
        
        // Пытаемся найти время региона
        $region_data = get_region_data($region_code);
        if ($region_data) {
            // Корректируем часовой пояс
            $timezone = $region_data["timezone"];
            $timezoneName = timezone_name_from_abbr("", $timezone*3600, false);
            $date = new DateTime('now', new DateTimeZone($timezoneName));
            
            $end_hour = $region_data["end_workday"];
            $start_hour = $region_data["start_workday"];
            
            $dayOfWeek = $date->format('w'); 
            if ($dayOfWeek === 0 || $dayOfWeek === 6) {
                $end_hour = $region_data["end_holiday"];
                $start_hour = $region_data["start_holiday"];
            } 
        }
    
        // Получаем целевое время - вариант с 8 до 23
        $beforeDeadline = true;
        $deadline = clone $date;
        $deadline->setTime($end_hour, 0, 0 );  
        
        // Вариант до 8
        if ($date->format("H") < $start_hour) {
            $beforeDeadline = false;
            $deadline->setTime($start_hour, 0, 0 );
        }
        
        // Вариант после 23
        if ($date->format("H") >= $end_hour) {
            $beforeDeadline = false;
            $deadline->modify('+1 day');
            $deadline->setTime($start_hour, 0, 0 );
        }
        
        // Корректируем к utc
        $deadline->setTimezone(new DateTimeZone('UTC'));
    
        return [$deadline, $beforeDeadline];
    }

    // Функция получения таймера по региону
    function get_timer($region_code) {
        list($deadline, $beforeDeadline) = get_deadline($region_code);
        $now = new DateTime('now', new DateTimeZone('UTC'));
        $timer = date_diff($now, $deadline);
        return [$timer, $beforeDeadline];
    }
?>