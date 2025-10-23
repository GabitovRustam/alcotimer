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
    list($timer, $beforeDeadline) = get_timer($region_code);
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
  <meta property="og:image" content="https://alcotimer.ru/favicon.png">
  <meta property="og:site_name" content="Алкотаймер">
  <meta property="og:locale" content="ru_RU">

  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="stylesheet" href="style3.css">
</head>

<body>
  <div class="header">
    <div class="title">
      <img src="favicon.png" alt="Алкотаймер" width="64" height="64">
      Алкотаймер
    </div>
    <div class="region">
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
  </div>
  <div class="footer">
	<div class="footer-item">
		2025 <a href="mailto:gabitov_rustam@mail.ru">Рустам Габитов</a>
	</div>
	<div class="footer-item">
		<a href="https://www.flaticon.com/ru/free-icons/-" title="Время и дата иконки">Время и дата иконки от Metami septiana - Flaticon</a>
	</div>
  </div>
  <script src="script.js"></script>
</body>

</html>

						