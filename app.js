import { getWeatherData, makeModal } from "./utils/httpReq.js";
const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const showWeaterBox = document.querySelector("#show-weather");
const showForecastBox = document.querySelector("#weak-weather");
const locationButton = document.querySelector("#location");
const weakDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const searchHandler = async () => {
  const cityName = searchInput.value;
  if (!cityName) {
    makeModal("Enter City Name")
  }else{
    try {
      showForecastBox.innerHTML = "";
      showWeaterBox.innerHTML = "<div id='loader'></div>";
      const currentData = await getWeatherData("current", cityName);
      const forecastData = await getWeatherData("forecast", cityName);
      showNowWeather(currentData);
      showForecast(forecastData);
    } catch (error) {
      console.log(error.message);
      showWeaterBox.innerHTML = "";
    }
  }
};
const showNowWeather = (data) => {
  showWeaterBox.innerHTML = `
  <h1>${data.name}, ${data.sys.country}</h1>
  <div id="main">
      <img src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }@2x.png" alt="">
      <span>${data.weather[0].description}</span>
      <p>${Math.round(data.main.temp)} °C</p>
  </div>
  <div id="info">
      <p>Humidity: <span>${data.main.humidity} %</span></p>
      <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
  </div>
`;
};
const showForecast = (data) => {
  showForecastBox.innerHTML = "";
  const forecastData = data.list.filter((i) => i.dt_txt.endsWith("3:00:00"));
  forecastData.forEach((item) => {
    const forecastJSX = `
        <div class="show-weak-weather">
          <img src="https://openweathermap.org/img/wn/${
            item.weather[0].icon
          }@2x.png" alt="forecast img">
          <h3>${weakDays[new Date(item.dt * 1000).getDay()]}</h3>
          <p>${Math.round(item.main.temp)} °C</p>
          <span>${item.weather[0].main}</span>
        </div>  
        `;
    showForecastBox.innerHTML += forecastJSX;
  });
};

const positionCallback = async (position) => {
  showForecastBox.innerHTML = "";
  const currentData = await getWeatherData("current", position.coords);
  const forecastData = await getWeatherData("forecast", position.coords);
  showNowWeather(currentData);
  showForecast(forecastData);
};
const errorCallback = (error) => {
  makeModal(error);
  showWeaterBox.innerHTML = "";
};

const locationHandler = () => {
  showWeaterBox.innerHTML = "<div id='loader'></div>";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    makeModal("your pc havnt access to geoLocation");
  }
};
searchButton.addEventListener("click", searchHandler);
locationButton.addEventListener("click", locationHandler);
