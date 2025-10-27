document.addEventListener('DOMContentLoaded', () => {
  var deadline = new Date();
  var beforeDeadline = true;
  
  // Ищем элементы DOM
  const selectRegion = document.getElementById('region-select');
  const elTitle = document.querySelector('.timer_title');
  const elHours = document.querySelector('.timer__hours');
  const elMinutes = document.querySelector('.timer__minutes');
  const elSeconds = document.querySelector('.timer__seconds');
  const location = document.getElementById('location');
  
  location.addEventListener('click', function() {
      getCurrentGeolocation();
    });

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
          regions.set(obj.code, { name: obj.name, svg: obj.svg });
        });

    })
    .catch(error => {
        console.error('Ошибка при получение справочника регионов: ', error);
    });

  var geo_options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // Произведена геолокация
  function geolocated(){
    document.querySelector('#location object').data = "svg/location-on.svg";
    document.querySelector("#location object").getSVGDocument().querySelector("path").setAttribute("fill", "#000000")
  }

  // Отмена геолокации
  function not_geolocated(){
    document.querySelector('#location object').data = "svg/location.svg";
    document.querySelector("#location object").getSVGDocument().querySelector("path").setAttribute("fill", "#000000")
  }

  // Ошибка геолокации
  function error_geolocated(){
    document.querySelector('#location object').data = "svg/location.svg";
    document.querySelector("#location object").getSVGDocument().querySelector("path").setAttribute("fill", "#500000")
  }

  function geo_success(pos) {
    var crd = pos.coords;
    getRedionByLatAndLon(crd.latitude, crd.longitude)
  }

  function geo_error(err) {
    getRegionByIP();
  }
  
  // Получение геолокации
  const getCurrentGeolocation = () =>
  {
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    } else
    {
      getRegionByIP();
    };
  }  

  // Поулчение региона по геолокации
  const getRedionByLatAndLon = (lat, lon) =>
  {
    if (!lat || !lon) {
      error_geolocated();
      return '';
    }
    
    // Получение региона
    fetch('get_region_by_lat_lon.php?lat='+lat+'&lon='+lon) 
      .then(response => {
          if (!response.ok) {
              throw new Error('Проблемы с сетью');
          }
          return response.json();
      })
      .then(data => {
          // Если так и не смогли определить, то по умолчанию Москва
          if (!data.region_code) {
            data.region_code = 'Moscow'
          }

          changeRegion(data.region_code);
          geolocated();
      })
      .catch(error => {
          error_geolocated();
          console.error('Ошибка при получение региона по IP: ', error);
      });
  }

  // Получение региона по ip
  function getRegionByIP () {
    // Получение региона
    fetch('get_region_by_ip.php') 
      .then(response => {
          if (!response.ok) {
              throw new Error('Проблемы с сетью');
          }
          return response.json();
      })
      .then(data => {
          // Если так и не смогли определить, то по умолчанию Москва
          if (!data.region_code) {
            data.region_code = 'Moscow'
          }
          
          changeRegion(data.region_code);
          geolocated();
      })
      .catch(error => {
          error_geolocated();
          console.error('Ошибка при получение региона по IP: ', error);
      });    
  }


  // Функция смены региона
  const changeRegion = (newRegion) => {
      region = newRegion;
      selectRegion.value = region;
      // Сохраняем регион
      localStorage.setItem('region', region);
      // Меняем URL
      var path = '/index.php?region='+region+'&id='+Math.floor(Date.now() / 1000);
      var title = 'Алкотаймер - ' + region;
      if (regions.has(region)) {
        title = 'Алкотаймер - ' + regions.get(region).name;
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

          if (regions.has(region)) {
            const svgElement = document.querySelector(".back object").getSVGDocument();
            if (svgElement) {
              const pathElements = svgElement.querySelectorAll('path');
              pathElements.forEach(path => {
                path.removeAttribute("style");
              })

              if (beforeDeadline) {
                svgElement.getElementById(regions.get(region).svg).setAttribute("style", "fill:#EEFFEE;stroke-width:0.5px;");
              } else {
                svgElement.getElementById(regions.get(region).svg).setAttribute("style", "fill:#FFEEEE;stroke-width:0.5px;");
              }
              
              const elbox = document.querySelector(".back").getBoundingClientRect()
              const bbox = svgElement.getElementById(regions.get(region).svg).getBBox();
              bbox.x = bbox.x - 0.3*bbox.width - 1.0437;
              bbox.y = bbox.y - 0.3*bbox.height - 8.2168;
              bbox.width = bbox.width + 0.6*bbox.width;
              bbox.height = bbox.height + 0.6*bbox.height;
              ratio_width = bbox.width/elbox.width;
              ratio_height = bbox.height/elbox.height;
              if (ratio_width < ratio_height) {
                old_width = bbox.width
                bbox.width = bbox.height * elbox.width / elbox.height;
                bbox.x =  bbox.x - (bbox.width  - old_width) / 2;
              } else {
                old_height = bbox.height
                bbox.height = bbox.width * elbox.height / elbox.width;
                bbox.y =  bbox.y - (bbox.height  - old_height) / 2;
              }
              svgElement.getElementById("Layer_1").setAttribute("viewBox", bbox.x + " " + bbox.y + " " + bbox.width + " " + bbox.height);
              svgElement.getElementById("Layer_1").setAttribute("reserveAspectRatio", "xMidYMid meet");
            }
          }
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
      not_geolocated();
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

    // определяем регион по ip
    getRegionByIP();
  }

  getDeadline(region)

  // Прорисовываем текущее значение таймера
  updateTimer();
  
  // Запускаем таймер с интервалом в секунду
  const timerId = setInterval(updateTimer, 1000);
});