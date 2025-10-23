document.addEventListener('DOMContentLoaded', () => {
  // Получаем сохранненый регион
  var region = localStorage.getItem('region')
  
  // Справочник по регионам
  const regions = new Map();
  regions.set('Adygeya', {name: 'Адыгея', timezone: 3, end_workday: 22, start_workday: 11 });
  regions.set('Altai', {name: 'Алтай', timezone: 7, end_workday: 23, start_workday: 10 });
  regions.set('AltaiT', {name: 'Алтайский край', timezone: 7, end_workday: 22, start_workday: 09 });
  regions.set('Amur', {name: 'Амурская обл.', timezone: 9, end_workday: 21, start_workday: 11 });
  regions.set('Arkhangelsk', {name: 'Архангельская обл.', timezone: 3, end_workday: 21, start_workday: 10 });
  regions.set('Astrakhan', {name: 'Астраханская обл.', timezone: 4, end_workday: 22, start_workday: 10 });
  regions.set('Bashkortostan', {name: 'Башкортостан', timezone: 5, end_workday: 23, start_workday: 08 });
  regions.set('Belgorod', {name: 'Белгородская обл.', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Bryansk', {name: 'Брянская обл.', timezone: 3, end_workday: 22, start_workday: 08 });
  regions.set('Buryatia', {name: 'Бурятия', timezone: 8, end_workday: 21, start_workday: 09 });
  regions.set('Volgograd', {name: 'Волгоградская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Vologda', {name: 'Вологодская обл.', timezone: 3, end_workday: 14, start_workday: 12, end_holiday: 23, start_holiday: 08 });
  regions.set('Voronezh', {name: 'Воронежская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Vladimir', {name: 'Владимирская обл.', timezone: 3, end_workday: 21, start_workday: 09 });
  regions.set('Daghestan', {name: 'Дагестан', timezone: 3, end_workday: 20, start_workday: 10 });
  regions.set('Jewish', {name: 'Еврейская АО', timezone: 10, end_workday: 22, start_workday: 11 });
  regions.set('Trans-Baikal', {name: 'Забайкальский край', timezone: 9, end_workday: 23, start_workday: 10 });
  regions.set('Ivanovo', {name: 'Ивановская обл.', timezone: 3, end_workday: 21, start_workday: 09 });
  regions.set('Ingushetia', {name: 'Ингушетия', timezone: 3, end_workday: 20, start_workday: 10 });
  regions.set('Irkutsk', {name: 'Иркутская обл.', timezone: 8, end_workday: 21, start_workday: 09 });
  regions.set('Kabardino-Balkarian', {name: 'Кабардино-Балкария', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Kaliningrad', {name: 'Калининградская обл.', timezone: 2, end_workday: 21, start_workday: 11 });
  regions.set('Kalmykia', {name: 'Калмыкия', timezone: 3, end_workday: 20, start_workday: 10 });
  regions.set('Kaluga', {name: 'Калужская обл.', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Kamchatka', {name: 'Камчатский край', timezone: 12, end_workday: 22, start_workday: 10 });
  regions.set('Karachayevo-Circassian', {name: 'Карачаево-Черкесия', timezone: 3, end_workday: 21, start_workday: 11 });
  regions.set('Karelia', {name: 'Карелия', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Kemerovo', {name: 'Кемеровская обл.', timezone: 7, end_workday: 23, start_workday: 08 });
  regions.set('Kirov', {name: 'Кировская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Komi ', {name: 'Коми', timezone: 3, end_workday: 22, start_workday: 08 });
  regions.set('Kostroma', {name: 'Костромская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Krasnodar', {name: 'Краснодарский край', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Krasnoyarsk', {name: 'Красноярский край', timezone: 7, end_workday: 23, start_workday: 08 });
  regions.set('Crimea', {name: 'Крым', timezone: 3, end_workday: 23, start_workday: 10 });
  regions.set('Kurgan', {name: 'Курганская обл.', timezone: 5, end_workday: 22, start_workday: 08 });
  regions.set('Kursk', {name: 'Курская обл.', timezone: 3, end_workday: 22, start_workday: 08 });
  regions.set('Leningrad', {name: 'Ленинградская обл.', timezone: 3, end_workday: 22, start_workday: 11 });
  regions.set('Lipetsk', {name: 'Липецкая обл.', timezone: 3, end_workday: 21, start_workday: 09 });
  regions.set('Magadan', {name: 'Магаданская обл.', timezone: 11, end_workday: 22, start_workday: 10 });
  regions.set('Mari El', {name: 'Марий Эл', timezone: 3, end_workday: 22, start_workday: 09 });
  regions.set('Mordovia', {name: 'Мордовия', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Moscow', {name: 'Москва', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('MoscowR', {name: 'Московская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Murmansk', {name: 'Мурманская обл.', timezone: 3, end_workday: 21, start_workday: 11 });
  regions.set('Nenets', {name: 'Ненецкий АО', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Nizhny Novgorod', {name: 'Нижегородская обл.', timezone: 3, end_workday: 22, start_workday: 09 });
  regions.set('Novgorod', {name: 'Новгородская обл.', timezone: 3, end_workday: 22, start_workday: 08 });
  regions.set('Novosibirsk', {name: 'Новосибирская обл.', timezone: 7, end_workday: 22, start_workday: 09 });
  regions.set('Omsk', {name: 'Омская обл.', timezone: 6, end_workday: 22, start_workday: 10 });
  regions.set('Orenburg', {name: 'Оренбургская обл.', timezone: 5, end_workday: 22, start_workday: 10 });
  regions.set('Orel', {name: 'Орловская обл.', timezone: 3, end_workday: 21, start_workday: 10 });
  regions.set('Penza', {name: 'Пензенская обл.', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Perm', {name: 'Пермский край', timezone: 5, end_workday: 23, start_workday: 08 });
  regions.set('Primorye', {name: 'Приморский край', timezone: 10, end_workday: 22, start_workday: 10 });
  regions.set('Pskov', {name: 'Псковская обл.', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Rostov', {name: 'Ростовская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Ryazan', {name: 'Рязанская обл.', timezone: 3, end_workday: 22, start_workday: 08 });
  regions.set('Samara', {name: 'Самарская обл.', timezone: 4, end_workday: 23, start_workday: 08 });
  regions.set('St-Petersburg', {name: 'Санкт-Петербург', timezone: 3, end_workday: 22, start_workday: 11 });
  regions.set('Saratov', {name: 'Саратовская обл.', timezone: 4, end_workday: 22, start_workday: 10 });
  regions.set('Sakha', {name: 'Саха', timezone: 9, end_workday: 20, start_workday: 14 });
  regions.set('Sakhalin', {name: 'Сахалинская обл.', timezone: 11, end_workday: 22, start_workday: 08 });
  regions.set('Sverdlovsk', {name: 'Свердловская обл.', timezone: 5, end_workday: 23, start_workday: 08 });
  regions.set('Sevastopol', {name: 'Севастополь', timezone: 3, end_workday: 22, start_workday: 08 });
  regions.set('North Ossetia', {name: 'Северная Осетия', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Smolensk', {name: 'Смоленская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Stavropol', {name: 'Ставропольский край', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Tambov', {name: 'Тамбовская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Tatarstan', {name: 'Татарстан', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Tver', {name: 'Тверская обл.', timezone: 3, end_workday: 22, start_workday: 10 });
  regions.set('Tomsk', {name: 'Томская обл.', timezone: 7, end_workday: 22, start_workday: 10 });
  regions.set('Tula', {name: 'Тульская обл.', timezone: 3, end_workday: 22, start_workday: 14, end_holiday: 22, start_holiday: 12 });
  regions.set('Tuva', {name: 'Тыва', timezone: 7, end_workday: 15, start_workday: 11 });-
  regions.set('Tyumen', {name: 'Тюменская обл.', timezone: 5, end_workday: 21, start_workday: 08 });
  regions.set('Udmurtian', {name: 'Удмуртия', timezone: 4, end_workday: 22, start_workday: 10 });
  regions.set('Ulyanovsk', {name: 'Ульяновская обл.', timezone: 4, end_workday: 23, start_workday: 08 });
  regions.set('Khabarovsk', {name: 'Хабаровский край', timezone: 10, end_workday: 22, start_workday: 10 });
  regions.set('Khakassia', {name: 'Хакасия', timezone: 7, end_workday: 23, start_workday: 08 });
  regions.set('Khanty-Mansi', {name: 'Ханты-Мансийский АО', timezone: 5, end_workday: 20, start_workday: 08 });
  regions.set('Chelyabinsk', {name: 'Челябинская обл.', timezone: 5, end_workday: 23, start_workday: 08 });
  regions.set('Chechen', {name: 'Чечня', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Chuvash', {name: 'Чувашия', timezone: 3, end_workday: 23, start_workday: 08 });
  regions.set('Chukotka', {name: 'Чукотский АО', timezone: 12, end_workday: 22, start_workday: 12 });
  regions.set('Yamal-Nenets', {name: 'Ямало-Ненецкий АО', timezone: 5, end_workday: 22, start_workday: 10 });
  regions.set('Yaroslavl', {name: 'Ярославская обл.', timezone: 3, end_workday: 23, start_workday: 08 });
  
  // Ищем элементы DOM
  const selectRegion = document.getElementById('region-select');
  const elTitle = document.querySelector('.timer_title');
  const elHours = document.querySelector('.timer__hours');
  const elMinutes = document.querySelector('.timer__minutes');
  const elSeconds = document.querySelector('.timer__seconds');

  // Сортируем регионы по русскому названию
  const regionsSorted = [...regions.entries()].sort(([, a], [, b]) => b.name >= a.nam);

  // Добавляем регионы в select
  regionsSorted.forEach(([key, value]) => {
    var newOption = new Option(value.name, key);
    selectRegion.add(newOption);
  });

  selectRegion.addEventListener('change', function() {
      changeRegion(this.value);
    });
    
  // Функция смены региона
  const changeRegion = (newRegion) => {
      region = newRegion;
      selectRegion.value = region
      // Сохраняем регион
      localStorage.setItem('region', region);
      // Меняем URL
      var path = '/index.php?region='+region
      var title = 'Алкотаймер - ' + region
      if (regions.has(region)) {
        title = 'Алкотаймер - ' + regions.get(region).name
      }
      document.title = title
      history.pushState({route: path}, title, path);
  }; 
  
  // Функция склонения числительных
  const declensionNum = (num, words) => {
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]];
  };
  
  // Функция получения времени по региону и текущему времени
  const getDeadline = (region, now) => {
    // Время по умолчанию
    let timezone = 3
    let end_hour = 23
    let start_hour = 8
    let nowtz = new Date(now)
    
    // Получаем timezone текущего времени
    nowTimezone = -nowtz.getTimezoneOffset()
    
     // Пытаемся найти время региона
    if (regions.has(region)) {
      timezone = regions.get(region).timezone
      // Корректируем часовой пояс
      nowtz.setMinutes(nowtz.getMinutes() - nowTimezone + timezone * 60);
    
      end_hour = regions.get(region).end_workday
      start_hour = regions.get(region).start_workday
      
      // Для тех у кого есть ограничения для выходных проверям вдруг сейчас выходной
      if (regions.get(region).hasOwnProperty('end_holiday') 
        && regions.get(region).hasOwnProperty('start_holiday')) {
        const dayOfWeek = nowtz.getDay(); 
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          end_hour = regions.get(region).end_holiday
          start_hour = regions.get(region).start_holiday
        } 
      }
    } else {
      // Корректируем часовой пояс
      nowtz.setMinutes(nowtz.getMinutes() - nowTimezone + timezone * 60);
    }
   
    // Получаем целевое время - вариант с 8 до 23
    let beforeDeadline = true;
    const deadline = new Date(nowtz);
    deadline.setHours(end_hour);
    deadline.setMinutes(0);
    deadline.setSeconds(0);  
    
    // Вариант до 8
    if (nowtz.getHours() < start_hour) {
      beforeDeadline = false;
      deadline.setHours(start_hour);
      deadline.setMinutes(0);
      deadline.setSeconds(0);  
    }
    
    // Вариант после 23
    if (nowtz.getHours() >= end_hour) {
      beforeDeadline = false;
      deadline.setDate(deadline.getDate() + 1);
      deadline.setHours(start_hour);
      deadline.setMinutes(0);
      deadline.setSeconds(0);
    }
    
    // Корректируем
    deadline.setMinutes(deadline.getMinutes() + nowTimezone - timezone * 60);
   
    return [deadline, beforeDeadline]
  }

  // Функция обновления таймера
  const updateTimer = () => {
    // Текущее время
    const now = new Date();
    
    [deadline, beforeDeadline] = getDeadline(region, now)
    selectRegion.value = region
    
    if (beforeDeadline) {
      elTitle.textContent = 'До окончания продажи алкоголя:';
      timerColor = '#050'
    } else {
      timerColor = '#500'
      elTitle.textContent = 'До начала продажи алкоголя:';
    }
    
    elTitle.style.color = timerColor
    
    // Получаем значение таймера (в милисекундах)
    const diff = Math.max(0, deadline - now);
    
    // Получаем компоненты таймера
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
  
    // Выводим компоненты таймера
    elHours.textContent = String(hours).padStart(2, '0');
    elHours.style.color = timerColor
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elMinutes.style.color = timerColor
    elSeconds.textContent = String(seconds).padStart(2, '0');
    elSeconds.style.color = timerColor
  
    // Выводим единицы измерения компонентов
    elHours.dataset.title = declensionNum(hours, ['час', 'часа', 'часов']);
    elHours.style.color = timerColor
    elMinutes.dataset.title = declensionNum(minutes, ['минута', 'минуты', 'минут']);
    elMinutes.style.color = timerColor
    elSeconds.dataset.title = declensionNum(seconds, ['секунда', 'секунды', 'секунд']);
    elSeconds.style.color = timerColor
  };

  // Получаем регион из параметров
  let params = new URLSearchParams(window.location.search);
  if (params.has('region')) {
    let regionParam = decodeURIComponent(params.get('region')); 
  
    if (regionParam) {
      changeRegion(regionParam);
    }
  }
  
  // Если региона нет, то пробуем его определить
  if (!region) {
    
    // Если так и не смогли определить, то по умолчанию Москва
    if (!region) {
      region = 'Moscow'
    }
    
    changeRegion(region);
  }
  
  // Прорисовываем текущее значение таймера
  updateTimer();
  
  // Запускаем таймер с интервалом в секунду
  const timerId = setInterval(updateTimer, 1000);
});