document.addEventListener('DOMContentLoaded', () => {
  var deadline = new Date();
  var beforeDeadline = true;
  
  // Ищем элементы DOM
  const selectRegion = document.getElementById('region-select');
  const elTitle = document.querySelector('.timer_title');
  const elHours = document.querySelector('.timer__hours');
  const elMinutes = document.querySelector('.timer__minutes');
  const elSeconds = document.querySelector('.timer__seconds');

  // Получаем сохранненый регион
  var region = localStorage.getItem('region');
  
  // Справочник по регионам
  var regions = new Map();
  fetch('get_regions.php') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Проблемы с сетью');
        }
        return response.json();
    })
    .then(data => {
        // Добавляем регионы в select
        data.forEach((obj) => {
          var newOption = new Option(obj.name, obj.code);
          selectRegion.add(newOption);
        });

    })
    .catch(error => {
        console.error('Ошибка при получение справочника регионов: ', error);
    });
  
  // Функция смены региона
  const changeRegion = (newRegion) => {
      region = newRegion;
      selectRegion.value = region
      // Сохраняем регион
      localStorage.setItem('region', region);
      // Меняем URL
      var path = '/index.php?region='+region+'&id='+Math.floor(Date.now() / 1000)
      var title = 'Алкотаймер - ' + region
      if (regions.has(region)) {
        title = 'Алкотаймер - ' + regions.get(region).name
      }
      document.title = title
      getDeadline(region)
      history.pushState({route: path}, title, path);
  }; 
  
  // Функция склонения числительных
  const declensionNum = (num, words) => {
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]];
  };
  
  // Функция получения времени по региону и текущему времени
  const getDeadline = (region) => {
    // Получаем timezone текущего времени
    const now = new Date();
    nowTimezone = -now.getTimezoneOffset()

    // Получение дедлайна для региона
    fetch('get_deadline.php?region=' + region) 
      .then(response => {
          if (!response.ok) {
              throw new Error('Проблемы с сетью');
          }
          return response.json();
      })
      .then(data => {
          deadline = new Date(data.deadline.date);
          beforeDeadline = data.beforeDeadline;
          // Корректируем
          deadline.setMinutes(deadline.getMinutes() + nowTimezone);
      })
      .catch(error => {
          console.error('Ошибка при получение таймера региона: ', error);
      });
  }

  // Функция обновления таймера
  const updateTimer = () => {
    // Текущее время
    const now = new Date();
    
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

    if (diff == 0) {
      getDeadline(region)
    }
    
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

  selectRegion.addEventListener('change', function() {
      changeRegion(this.value);
    });
    
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

  getDeadline(region)

  // Прорисовываем текущее значение таймера
  updateTimer();
  
  // Запускаем таймер с интервалом в секунду
  const timerId = setInterval(updateTimer, 1000);
});