<?php
    require('RussianCalendar.php');

    // Получение региона по кладр
    function get_region_code_by_kladr($kladr)
    {
        require('dbconn.php');

        $conn = new mysqli($DBHost, $DBLogin, $DBPassword, $DBName);
        if($conn->connect_error){
            echo "Ошибка: " . $conn->connect_error;
        }

        $sql = "SELECT code FROM `regions` WHERE kladr = '" . $kladr . "'";
        if($result = $conn->query($sql)){
            $retval = mysqli_fetch_assoc($result);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }
        $conn->close();   
        return $retval['code'];
    }

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

        $sql = "SELECT code, `name`, svg FROM `regions` order by `name`";
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
        $timezone = '3';
        $end_hour = 23;
        $start_hour = 8;
        $timezoneName = "+03:00";
        $date = new DateTime('now', new DateTimeZone($timezoneName));
        
        // Пытаемся найти время региона
        $region_data = get_region_data($region_code);
        if ($region_data) {
            // Корректируем часовой пояс
            $timezone = $region_data["timezone"];
            $timezoneName = "+" . str_pad($timezone, 2, "0", STR_PAD_LEFT) . ":00";
            $date = new DateTime('now', new DateTimeZone($timezoneName));
            
            $end_hour = $region_data["end_workday"];
            $start_hour = $region_data["start_workday"];
            
            if (!checkWorkingDay($date)) {
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

    // Получение счетчиков посещения
    function get_counters() {
        require('dbconn.php');

        $conn = new mysqli($DBHost, $DBLogin, $DBPassword, $DBName);
        if($conn->connect_error){
            echo "Ошибка: " . $conn->connect_error;
        }

        // Инициализируем счетчики
        $all_hosts = 0;
        $all_views = 0;
        $today_hosts = 0;
        $today_views = 0;

        // Получаем IP-адрес посетителя и сохраняем текущую дату
        $visitor_ip = $_SERVER['REMOTE_ADDR'];
        $today = date("Y-m-d");        
        
        // Получаем текущее значение глобальных счетчиков
        $sql = "SELECT `id`, `hosts`, `views` FROM `visits`";
        if($result = $conn->query($sql)){
            $visits = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }

        // Если еще не было посещений вообще
        if (empty($visits))
        {
            $conn->query("INSERT INTO `visits` SET `hosts`= 0, `views`= 0");
            
            $sql = "SELECT `id`, `hosts`, `views` FROM `visits`";
            if($result = $conn->query($sql)){
                $visits = $result->fetch_all(MYSQLI_ASSOC);
                $result->free();
            } else{
                echo "Ошибка: " . $conn->error;
            }
        } 

        $visits_id = $visits[0]['id'];
        $all_hosts = $visits[0]['hosts'];
        $all_views = $visits[0]['views'] + 1;

        // Проверяем, есть ли уже в базе IP-адрес, с которого происходит обращение
        $sql = "SELECT `id` FROM `visit_ips` WHERE `ip`='$visitor_ip'";
        if($result = $conn->query($sql)){
            $visit_ips = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }

        // Если такого посетителя еще не было
        if (empty($visit_ips))
        {
            $all_hosts = $all_hosts + 1;
            $conn->query("INSERT INTO `visit_ips` SET `ip`= '$visitor_ip'");
            $sql = "SELECT `id` FROM `visit_ips` WHERE `ip`='$visitor_ip'";
            if($result = $conn->query($sql)){
                $visit_ips = $result->fetch_all(MYSQLI_ASSOC);
                $result->free();
            } else{
                echo "Ошибка: " . $conn->error;
            }
        }

        $visit_ips_id = $visit_ips[0]['id'];

        $conn->query("UPDATE `visits` SET `hosts`= $all_hosts, `views`= $all_views WHERE `id`=$visits_id");

        $sql = "SELECT `id`, `hosts`, `views` FROM `visit_dates` WHERE `date`='$today'";
        if($result = $conn->query($sql)){
            $visit_dates = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }

        // Если сегодня еще не было посещений
        if (empty($visit_dates))
        {
            // Очищаем таблицу ips
            $conn->query("DELETE FROM `visit_today_ip`");

            $conn->query("INSERT INTO `visit_dates` SET `date`='$today', `hosts`=0,`views`=0");

            $sql = "SELECT `id`, `hosts`, `views` FROM `visit_dates` WHERE `date`='$today'";
            if($result = $conn->query($sql)){
                $visit_dates = $result->fetch_all(MYSQLI_ASSOC);
                $result->free();
            } else{
                echo "Ошибка: " . $conn->error;
            }
        }

        $visit_dates_id = $visit_dates[0]['id'];
        $today_hosts = $visit_dates[0]['hosts'];
        $today_views = $visit_dates[0]['views'] + 1;

        // Проверяем, есть ли уже в базе IP-адрес, с которого происходит обращение
        $sql = "SELECT `id` FROM `visit_today_ip` WHERE `ip_id`='$visit_ips_id'";
        if($result = $conn->query($sql)){
            $visit_today_ip = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        } else{
            echo "Ошибка: " . $conn->error;
        }

        // Если такой IP-адрес новый
        if (empty($visit_today_ip))
        {
            $today_hosts = $today_hosts + 1;
             // Заносим в базу IP-адрес этого посетителя
            $conn->query("INSERT INTO `visit_today_ip` SET `ip_id`='$visit_ips_id'");
        }

        // Добавляем в базу +1 уникального посетителя (хост) и +1 просмотр (хит)
        $conn->query("UPDATE `visit_dates` SET `hosts`=$today_hosts, `views`=$today_views WHERE `id`=$visit_dates_id");

        $conn->close();   

        return [$all_hosts, $all_views, $today_hosts, $today_views];
    }

    function checkWorkingDay($date) {
        $cache_folder = './xmlcalendar';
        $cache_duration = 60*60*24; // кэш файла на сутки
        $calendar = new \gozoro\russian_calendar\RussianCalendar('ru', $cache_folder, $cache_duration);
        
        return $calendar->checkWorkingDay($date);
    }
?>