document.getElementById('getWeatherBtn').addEventListener('click', getWeather);

function getWeather() {
  const city = document.getElementById('city').value;
  const apiKey = '65ab76429097c0424a5405252a982500';  // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Clear previous results
  document.getElementById('weatherResult').innerHTML = '';
  document.getElementById('forecastResult').innerHTML = '';

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Fetch current weather
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      console.log("Current Weather Data:", data);
      displayCurrentWeather(data);
      changeBackground(data.weather[0].main);
      fetchForecast(city, apiKey);
    })
    .catch(error => {
      console.error(error);
      alert('Error fetching data: ' + error);
    });
}

function displayCurrentWeather(data) {
  const weatherData = `
    <h3>Weather in ${data.name}</h3>
    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
    <p><strong>Conditions:</strong> ${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
  `;
  document.getElementById('weatherResult').innerHTML = weatherData;
  document.getElementById('weatherResult').style.display = 'block';
}

function changeBackground(weatherCondition) {
  let backgroundUrl = '';

  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      backgroundUrl = 'https://via.placeholder.com/1920x1080/87CEEB/FFFFFF?text=Sunny';
      break;
    case 'rain':
      backgroundUrl = 'https://via.placeholder.com/1920x1080/4682B4/FFFFFF?text=Rainy';
      break;
    case 'clouds':
      backgroundUrl = 'https://via.placeholder.com/1920x1080/B0C4DE/FFFFFF?text=Cloudy';
      break;
    case 'snow':
      backgroundUrl = 'https://via.placeholder.com/1920x1080/ADD8E6/FFFFFF?text=Snowy';
      break;
    default:
      backgroundUrl = 'https://via.placeholder.com/1920x1080/98FB98/FFFFFF?text=Weather';
  }

  document.body.style.backgroundImage = `url(${backgroundUrl})`;
}

function fetchForecast(city, apiKey) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching forecast data');
      }
      return response.json();
    })
    .then(data => {
      console.log("Forecast Data:", data);
      displayForecast(data);
    })
    .catch(error => {
      console.error(error);
      alert('Error fetching forecast data: ' + error);
    });
}

function displayForecast(data) {
  const forecast = data.list.filter((item, index) => index % 8 === 0);  // Get data for every 24 hours (3-hour intervals)
  let forecastHtml = '<h3>5-Day Forecast</h3>';

  forecast.forEach(item => {
    forecastHtml += `
      <div class="forecast">
        <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
        <p>${item.main.temp} °C</p>
      </div>
    `;
  });

  document.getElementById('forecastResult').innerHTML = forecastHtml;
  document.getElementById('forecastResult').style.display = 'block';
}
// Clear previous results live when typing a new city
document.getElementById('city').addEventListener('input', () => {
  document.getElementById('weatherResult').innerHTML = '';
  document.getElementById('forecastResult').innerHTML = '';
  document.getElementById('weatherResult').style.display = 'none';
  document.getElementById('forecastResult').style.display = 'none';
});


