let myLatitude = "";
let myLongitude = "";
const apiKey = "61fed7decd915f9b031fb5a73d66db0c";
const status = document.querySelector("#status");
const mapLink = document.querySelector("#map-link");
const my_weather = document.querySelector(".my-weather");
const current_weather = document.querySelector(".current-weather");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const city_input_holder = document.querySelector(".city-input-holder");
const sumbit_btn = document.querySelector(".sumbit-btn");
const search_city = document.querySelector(".search-city");
const error_msg = document.querySelector(".error-msg");
const search_weather = document.querySelector(".search-weather");
const weather_icon = document.querySelector(".weather-icon");
cities = {};
async function getMyWeather(lat, lon) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const myWeather = await data.json();
    console.log(myWeather);
    const currentWeather = temperatureConverter(myWeather.main.temp);
    current_weather.innerHTML += ": " + currentWeather + "\xB0C.";
    sunrise.innerHTML += ": " + getUTCtimeStamp(myWeather.sys.sunrise);
    sunset.innerHTML += ": " + getUTCtimeStamp(myWeather.sys.sunset);
    weather_icon.src = `http://openweathermap.org/img/wn//${myWeather.weather[0].icon}.png`;
    getUTCtimeStamp();
    console.log(currentWeather);
  } catch (e) {
    console.log(e);
  }
}
function geoFindMe() {
  mapLink.href = "";
  mapLink.textContent = "";
  function success(position) {
    status.textContent = "";
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    myLatitude = latitude;
    myLongitude = longitude;
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    getMyWeather(latitude, longitude);
  }

  function error() {
    my_weather.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function temperatureConverter(valNum) {
  valNum = parseFloat(valNum);
  var num = Number(valNum - 273.15); // The Number() only visualizes the type and is not needed
  var roundedString = num.toFixed(2);
  return Number(roundedString);
}
function getUTCtimeStamp(valNum) {
  var sec = valNum;
  var date = new Date(sec * 1000);
  var timestr = date.toLocaleTimeString();

  return timestr;
}
async function getWeatherByCity() {
  error_msg.innerHTML = "";

  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city_input_holder.value}&appid=${apiKey}`;
  const reqData = await fetch(api);
  const data = await reqData.json();
  let cityWeather = "";
  if (data.cod == 404) {
    error_msg.innerHTML = "The city is not found ";
  }
  if (data.cod == 200) {
    if (cities[data.name] === undefined) {
      cities[data.name] = temperatureConverter(data.main.temp);
      cityWeather = `${data.name}: ${temperatureConverter(data.main.temp)}`;
      const cityElement = document.createElement("div");
      cityElement.classList.add("search-weather-result");
      cityElement.innerHTML = cityWeather + "\xB0C.";
      search_weather.insertAdjacentElement("afterend", cityElement);
    } else {
      error_msg.innerHTML = "you already search for this city";
    }
  }
  if (data.cod == 400) {
    error_msg.innerHTML = "You didnt search for nothing ";
  }
  console.log(cities);
}
//EVENTS
sumbit_btn.addEventListener("click", () => getWeatherByCity());
window.onload = geoFindMe();
