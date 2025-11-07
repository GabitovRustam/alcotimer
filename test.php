<?php
require('lib.php');

echo "<br />checkWorkingDay test start <br />";

$timezoneName = "+03:00";
$date = new DateTime('now', new DateTimeZone($timezoneName));
print "Дата: ".$date->format('d/m/Y')."\n";
print "ЭТО РАБОЧИЙ ДЕНЬ? ".(checkWorkingDay($date)?"ДА":"НЕТ")."\n"; // НЕТ

echo " <br />checkWorkingDay test end<br />";

echo "<br />RussianCalendar test start <br />";

$cache_folder = './xmlcalendar';
$cache_duration = 60*60*24; // кэш файла на сутки
$calendar = new \gozoro\russian_calendar\RussianCalendar('ru', $cache_folder, $cache_duration);
print "ЭТО РАБОЧИЙ ДЕНЬ? ".($calendar->checkWorkingDay($date)?"ДА":"НЕТ")."\n"; // НЕТ

print "ЭТО ПОЛНЫЙ РАБОЧИЙ ДЕНЬ? ".($calendar->checkFullWorkingDay($date)?"ДА":"НЕТ")."\n"; // НЕТ

print "ЭТО КОРОТКИЙ РАБОЧИЙ ДЕНЬ? ".($calendar->checkShortWorkingDay($date)?"ДА":"НЕТ")."\n"; // НЕТ

print "ЭТО ВЫХОДНОЙ ДЕНЬ? ".($calendar->checkWeekend($date)?"ДА":"НЕТ")."\n"; // ДА

print "ЭТО ПРАЗДНИЧНЫЙ ДЕНЬ? ".($calendar->checkHoliday($date)?"ДА":"НЕТ")."\n"; // ДА

print "НАЗВАНИЕ ПРАЗДНИКА: ".$calendar->getHolidayName($date)."\n"; // Новогодние каникулы (в ред. Федерального закона от 23.04.2012 № 35-ФЗ)

print "СЛЕДУЮЩИЙ РАБОЧИЙ ДЕНЬ: ".$calendar->getNextWorkingDay($date)."\n"; // 2019-01-09
echo " <br />RussianCalendar test end<br />";

?>