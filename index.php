<!doctype html>
<html lang="ru">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Алкотаймер</title>
  <!-- Open Graph Generated: a.pr-cy.ru -->
   <meta property="og:type" content="website">
<?php
  require('lib.php');

  $region_code =  $_GET['region'];
  $region_name = '';
  if (!empty($region_code)){
    $region_data = get_region_data($region_code);
    $region_name = $region_data['name'];
  }

  $title = 'Алкотаймер';
  $description = 'Таймер оставшегося времени до окончания продажи алкоголя';
  if (!empty($region_name)) {
    $title = 'Алкотаймер - '.$region_name;
    list($timer, $beforeDeadline, $actualBanDates, $banDates) = get_timer($region_code);
    $timerString = $timer->format('%H').':'.$timer->format('%I').':'.$timer->format('%S');
    $description = 'До начала продажи алкоголя: '.$timerString;
    if ($beforeDeadline) {
      $description = 'До окончания продажи алкоголя: '.$timerString;
    }
  } 

  echo '<meta property="og:title" content="'.$title.'">';
  echo '<meta property="og:description" content="'.$description.'">';
?>
  <meta property="og:url" content="https://alcotimer.ru/">
  <meta property="og:image" content="https://alcotimer.ru/png/cocktail.png">
  <meta property="og:site_name" content="Алкотаймер">
  <meta property="og:locale" content="ru_RU">
  <meta name="description" content="Таймер оставшегося времени до окончания продажи алкоголя" />

  <link rel="icon" href="svg/cocktail.svg" type="image/svg+xml">
  <link rel="stylesheet" href="style/style2.css">
</head>

<body>
  <div class="back">
    <object class="back-obj" type="image/svg+xml" data="svg/russia.svg"></object>
  </div>
  <div class="header">
    <div class="title">
      <img src="svg/cocktail.svg" type="image/svg+xml" alt="Алкотаймер" width="64" height="64">
      Алкотаймер
    </div>
    <div class="region">
      <a id="location" href="javascript:void(0);">
        <object type="image/svg+xml" data="svg/location.svg" width="32" height="32" style="pointer-events: none;"></object>
      </a>
      <select name="region" id="region-select"></select>
    </div>    
  </div>
  <div class="timer">
    <div class="timer_title">Алкотаймер:</div>
    <div class="timer_counter">
      <div class="timer__item timer__hours">00</div>
      <div class="separator">:</div>
      <div class="timer__item timer__minutes">00</div>
      <div class="separator">:</div>
      <div class="timer__item timer__seconds">00</div>
    </div>
    <div class="ban_days">
      <div class="ban_days_all_title">
        <div class="ban_days_title">
          Актуальные особые дни запрета
        </div>
        <a id="ban_days_show_all" href="javascript:void(0);">
          [все]
        </a>
      </div>
      <div class="ban_days_list">
        нет
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-counter">
<?php
  list($all_hosts, $all_views, $today_hosts, $today_views) = get_counters($region_code);
  echo '<img class="counterIcon" src="png/day.png" type="image/png" alt="За сегодня" title="За сегодня" width="12" height="12">';
  echo $today_hosts;
  echo '<img class="counterIcon" src="png/man.png" type="image/png" alt="посетителей" title="посетителей" width="12" height="12">';
  echo $today_views;
  echo '<img class="lastCounterIcon" src="png/eye.png" type="image/png" alt="просмотров" title="просмотров" width="12" height="12">';
  echo '<br />';
  echo '<img class="counterIcon" src="png/all.png" type="image/png" alt="Всего" title="Всего" width="12" height="12">';
  echo $all_hosts;
  echo '<img class="counterIcon" src="png/man.png" type="image/png" alt="посетителей" title="посетителей" width="12" height="12">';
  echo $all_views ;
  echo '<img class="lastCounterIcon" src="png/eye.png" type="image/png" alt="просмотров" title="просмотров" width="12" height="12">';
?>
    </div>
    <div class="footer-item">
      2025 <a href="mailto:gabitov_rustam@mail.ru">Рустам Габитов</a>
    </div>
  </div>
  <script src="script/script2.js"></script>
</body>

</html>

						