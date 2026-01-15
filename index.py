import logging
import os
import sys
from datetime import datetime, timezone, timedelta, date
import urllib.request
import xml.etree.ElementTree as ET

logging.basicConfig(
    filename=os.path.expanduser('~/app.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filemode="a"
)
sys.path.append(os.path.expanduser('~/'))
sys.path.append(os.path.expanduser('~/venv/lib/python3.10/site-packages/'))

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import mysql.connector
from dadata import Dadata

import dbconn
import dadataconf

app = Flask(__name__)
application = app

# Connect to server
cnx = mysql.connector.connect(
    host=dbconn.host,
    database=dbconn.database,
    user=dbconn.user,
    password=dbconn.password)

# Get a cursor
cur = cnx.cursor()

# Получение информации по региону
def get_region_data(region_code):

    sql = "SELECT `id`, `code`, `name`, `timezone`, `start_workday`, `end_workday`, `start_holiday`, `end_holiday`, `kladr`, `svg` FROM `regions` WHERE code = '" + region_code + "'"
    cur.execute(sql)
    result = cur.fetchone()

    return result

# Функция получения дней запрета по региону
def get_ban_dates(region_code):

    sql = "SELECT `ban_dates`.`start_date`, `ban_dates`.`end_date`, `ban_dates`.`name`, `ban_dates`.`exactly` FROM `ban_dates` JOIN `region_ban_dates` ON `region_ban_dates`.`ban_date_id` = `ban_dates`.`id` JOIN `regions` ON `region_ban_dates`.`region_id` = `regions`.`id` where `regions`.`code` = '" + region_code + "'"
    cur.execute(sql)
    result = cur.fetchall()

    return result

# Получение списка регионов
def get_regions():

    sql = "SELECT code, `name`, svg FROM `regions` order by `name`"
    cur.execute(sql)
    result = cur.fetchall()

    return result

# Получение региона по кладр
def get_region_code_by_kladr(kladr):
    sql = "SELECT code FROM `regions` WHERE kladr = '" + kladr + "'"
    cur.execute(sql)
    result = cur.fetchone()

    return result[0]

# Получение счетчиков посещения
def get_counters(visitor_ip):

    # Инициализируем счетчики
    all_hosts = 0
    all_views = 0
    today_hosts = 0
    today_views = 0

    # Cохраняем текущую дату
    today = date.today().strftime("%Y-%m-%d")

    # Получаем текущее значение глобальных счетчиков
    sql = "SELECT `id`, `hosts`, `views` FROM `visits`"
    cur.execute(sql)
    visits = cur.fetchone()

    # Если еще не было посещений вообще
    if visits is None:
        cur.execute("INSERT INTO `visits` SET `hosts`= 0, `views`= 0")
        cnx.commit()

        sql = "SELECT `id`, `hosts`, `views` FROM `visits`"
        cur.execute(sql)
        visits = cur.fetchone()

    visits_id = visits[0]
    all_hosts = visits[1]
    all_views = visits[2] + 1

    # Проверяем, есть ли уже в базе IP-адрес, с которого происходит обращение
    sql = f"SELECT `id` FROM `visit_ips` WHERE `ip`='{visitor_ip}'"
    cur.execute(sql)
    visit_ips = cur.fetchone()

    # Если такого посетителя еще не было
    if visit_ips is None:
        all_hosts = all_hosts + 1
        cur.execute(f"INSERT INTO `visit_ips` SET `ip`= '{visitor_ip}'")
        cnx.commit()

        sql = f"SELECT `id` FROM `visit_ips` WHERE `ip`='{visitor_ip}'"
        cur.execute(sql)
        visit_ips = cur.fetchone()

    visit_ips_id = visit_ips[0]

    cur.execute(f"UPDATE `visits` SET `hosts`= {all_hosts}, `views`= {all_views} WHERE `id`= {visits_id}")
    cnx.commit()

    sql = f"SELECT `id`, `hosts`, `views` FROM `visit_dates` WHERE `date`='{today}'"
    cur.execute(sql)
    visit_dates = cur.fetchone()

    # Если сегодня еще не было посещений
    if visit_dates is None:
        # Очищаем таблицу ips
        cur.execute("DELETE FROM `visit_today_ip`")
        cnx.commit()

        cur.execute(f"INSERT INTO `visit_dates` SET `date`='{today}', `hosts`=0,`views`=0")
        cnx.commit()

        sql = f"SELECT `id`, `hosts`, `views` FROM `visit_dates` WHERE `date`='{today}'"
        cur.execute(sql)
        visit_dates = cur.fetchone()

    visit_dates_id = visit_dates[0]
    today_hosts = visit_dates[1]
    today_views = visit_dates[2] + 1

    # Проверяем, есть ли уже в базе IP-адрес, с которого происходит обращение
    sql = f"SELECT `id` FROM `visit_today_ip` WHERE `ip_id`='{visit_ips_id}'"
    cur.execute(sql)
    visit_today_ip = cur.fetchone()

    # Если такой IP-адрес новый
    if visit_today_ip is None:
        today_hosts += 1
        # Заносим в базу IP-адрес этого посетителя
        cur.execute(f"INSERT INTO `visit_today_ip` SET `ip_id`='{visit_ips_id}'")
        cnx.commit()

    # Добавляем в базу +1 уникального посетителя (хост) и +1 просмотр (хит)
    cur.execute(f"UPDATE `visit_dates` SET `hosts`={today_hosts}, `views`={today_views} WHERE `id`={visit_dates_id}")
    cnx.commit()

    return all_hosts, all_views, today_hosts, today_views

# Проверка рабочего дня
def checkWorkingDay(date):
    is_workday = date.weekday() <= 4

    cache_file = os.path.expanduser(f'~/public_html/xmlcalendar/calendar-{date.year}-ru')
    need_load_calendar = True
    if os.path.exists(cache_file):
        modified = datetime.fromtimestamp(os.path.getmtime(cache_file))
        if modified  + timedelta(days=1) > datetime.now():
            need_load_calendar = False

    if need_load_calendar:
        url = f'https://raw.githubusercontent.com/xmlcalendar/xmlcalendar.github.io/main/data/ru/{date.year}/calendar.xml'
        urllib.request.urlretrieve(url, cache_file)

    tree = ET.parse(cache_file)
    root = tree.getroot()

    # Итерируемся по всем элементам
    str_date = date.strftime("%m.%d")
    for day in root.findall('.//day'):
        if day.attrib['d'] == str_date:
            is_workday = day.attrib['t'] != "1"

    return is_workday

# Функция получения времени по региону в utc
def get_deadline(region_code):

    # Время по умолчанию
    tz = 3
    tz_ = timezone(timedelta(hours=tz))
    end_hour = 23
    start_hour = 8
    date = datetime.now(tz_)
    actualBanDates = []
    banDates = []

    # Пытаемся найти время региона
    region_data = get_region_data(region_code)
    if len(region_data) > 0:
        # Корректируем часовой пояс
        tz = region_data[3]
        tz_ = timezone(timedelta(hours=tz))
        date = datetime.now(tz_)

        # Учитываем особые дни запрета
        banDates = get_ban_dates(region_code)
        i = 1
        while True:
            date_changed = False
            i += 1
            for ban_date in banDates:
                start_date = datetime.combine(ban_date[0], datetime.min.time()).replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=tz_)
                end_date = datetime.combine(ban_date[1], datetime.min.time()).replace(hour=23, minute=59, second=59, microsecond=999999, tzinfo=tz_)

                if start_date <= date and end_date >= date:
                    actualBanDates.append(ban_date)
                    if ban_date[3]:
                        date = end_date + timedelta(seconds=60)
                        date_changed = True

            if not date_changed or i > 50:
                break

        start_hour = region_data[4]
        end_hour = region_data[5]

        if not checkWorkingDay(date):
            start_hour = region_data[6]
            end_hour = region_data[7]

    # Получаем целевое время - вариант с 8 до 23
    beforeDeadline = True
    deadline = date.replace(hour=end_hour, minute=0, second=0, microsecond=0)

    # Вариант до 8
    if date.hour < start_hour:
        beforeDeadline = False
        deadline = date.replace(hour=start_hour, minute=0, second=0, microsecond=0)

    # Вариант после 23
    if date.hour >= end_hour:
        beforeDeadline = False
        deadline = deadline + timedelta(days=1)
        deadline = deadline.replace(hour=start_hour, minute=0, second=0, microsecond=0)

    # Корректируем к utc
    deadline = deadline.astimezone(timezone.utc)

    return deadline, beforeDeadline, actualBanDates, banDates


# Функция получения таймера по региону
def get_timer(region_code):
    deadline, beforeDeadline, actualBanDates, banDates = get_deadline(region_code)
    now = datetime.now(timezone.utc)
    timer = deadline - now
    return timer, beforeDeadline, actualBanDates, banDates


@app.route('/')
def index():
    title = 'Алкотаймер'
    description = 'Таймер оставшегося времени до окончания продажи алкоголя'

    region_code = request.args.get('region', '')
    region_name = ''
    if region_code:
        region_data = get_region_data(region_code)
        if region_data:
            region_name = region_data[2]

    if region_name:
        title = 'Алкотаймер - '+ region_name
        timer, beforeDeadline, actualBanDates, banDates = get_timer(region_code)
        total_seconds = int(timer.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        hours_str = f"{hours}"
        if hours < 10:
            hours_str = "0" + hours_str
        minutes_str = f"{minutes}"
        if minutes < 10:
            minutes_str = "0" + minutes_str
        seconds_str = f"{seconds}"
        if seconds < 10:
            seconds_str = "0" + seconds_str
        timerString = hours_str + ':'+ minutes_str+ ':'+ seconds_str
        description = 'До начала продажи алкоголя: ' + timerString
        if beforeDeadline:
            description = 'До окончания продажи алкоголя: ' + timerString

    all_hosts, all_views, today_hosts, today_views = get_counters(request.remote_addr)

    return render_template('index.html',
        title=title,
        description=description,
        today_hosts=today_hosts,
        today_views=today_views,
        all_hosts=all_hosts,
        all_views=all_views)

@app.route('/get_regions_deadline')
def get_regions_deadline():

    regions = get_regions()

    allregions = []
    for region in regions:
        deadline, beforeDeadline, actualBanDates, banDates = get_deadline(region[0])
        newregion = {}
        newregion['code'] = region[0]
        newregion['name'] = region[1]
        newregion['svg'] = region[2]
        newregion['deadline'] = deadline
        newregion['beforeDeadline'] = beforeDeadline
        newregion['actualBanDates'] = actualBanDates
        newregion['banDates'] = banDates
        allregions.append(newregion)

    return jsonify(allregions)

@app.route('/get_regions')
def get_regions_end():

    regions = get_regions()

    allregions = []
    for region in regions:
        newregion = {}
        newregion['code'] = region[0]
        newregion['name'] = region[1]
        newregion['svg'] = region[2]
        allregions.append(newregion)

    return jsonify(allregions)

@app.route('/get_deadline')
def get_deadline_end():

    region_code = request.args.get('region', 'Moscow')

    deadline, beforeDeadline, actualBanDates, banDates = get_deadline(region_code)

    banDatesNames = []
    for banDate in banDates:
        newbanDate = {}
        newbanDate['name'] = banDate[2]
        newbanDate['exactly'] = str(banDate[3])
        banDatesNames.append(newbanDate)

    actualBanDatesNames = []
    for actualBanDate in actualBanDates:
        newActualBanDate = {}
        newActualBanDate['name'] = actualBanDate[2]
        newActualBanDate['exactly'] = str(actualBanDate[3])
        actualBanDatesNames.append(newActualBanDate)

    data = {
        'deadline': {'date': deadline.strftime("%Y-%m-%d %H:%M:%S.%f")},
        'beforeDeadline': beforeDeadline,
        'actualBanDates': actualBanDatesNames,
        'banDates': banDatesNames}

    return jsonify(data)

@app.route('/get_region_by_ip')
def get_region_by_ip():

    ip = request.remote_addr

    dadata = Dadata(dadataconf.token)
    result = dadata.iplocate(ip)

    region_code = get_region_code_by_kladr(result['data']['region_kladr_id'][0:2])
    data = {'region_code': region_code}

    return jsonify(data)

@app.route('/get_region_by_lat_lon')
def get_region_by_lat_lon():

    lat = float(request.args.get('lat', ''))
    lon = float(request.args.get('lon', ''))

    dadata = Dadata(dadataconf.token)
    result = dadata.geolocate(name="address", lat=lat, lon=lon)

    region_code = get_region_code_by_kladr(result[0]['data']['region_kladr_id'][0:2])
    data = {'region_code': region_code}

    return jsonify(data)

# Получение таблицы лидеров
def get_taptheslime_leadership(user_id, user_name, gems, coins):

    # Проверяем, есть ли уже в базе игрок
    sql = f"SELECT `userid` FROM `players` WHERE `userid`='{user_id}'"
    cur.execute(sql)
    player = cur.fetchone()

    # Если такого посетителя еще не было
    if player is None:
        cur.execute(f"INSERT INTO `players` SET `userid`='{user_id}'")
        cnx.commit()

    cur.execute(f"UPDATE `players` SET `username`= '{user_name}', `gems`= {gems}, `coins`= {coins} WHERE `userid`= '{user_id}'")
    cnx.commit()

    sql = f"SELECT `userid`, `username`, `gems`, `coins` FROM `players` WHERE `userid`= '{user_id}'"
    cur.execute(sql)
    player_info = cur.fetchone()

    sql = f"SELECT count(*) FROM `players` WHERE `gems` > {gems} OR (`gems` = {gems} AND `coins` > {coins}) OR (`gems` = {gems} AND `coins` = {coins} AND `userid` > '{user_id}')"
    cur.execute(sql)
    player_position = cur.fetchone()[0] + 1

    sql = "SELECT count(*) FROM `players`"
    cur.execute(sql)
    all_players_count = cur.fetchone()[0]

    sql = "SELECT `userid`, `username`, `gems`, `coins` FROM `players` ORDER BY `gems` DESC, `coins` DESC, `userid` DESC LIMIT 10"
    cur.execute(sql)
    leadership_info = cur.fetchall()

    return {'player': player_info, 'leadership': leadership_info, 'all_players_count': all_players_count, 'player_position': player_position}

@app.route('/taptheslime')
def taptheslime():
    user_id = request.args.get('id', 'empty')
    user_name = request.args.get('name', 'пустой')
    gems = int(request.args.get('gems', '0'))
    coins = int(request.args.get('coins', '0'))

    result = get_taptheslime_leadership(user_id, user_name, gems, coins)
    return str(result)


@app.route('/test')
def test():
    result = get_deadline('Bashkortostan')
    return str(result)

if __name__ == '__main__':
    app.run()