let myLatitude = "";
let myLongitude = "";
const apiKey = "61fed7decd915f9b031fb5a73d66db0c";
const status = document.querySelector("#status");
const mapLink = document.querySelector("#map-link");
const my_weather = document.querySelector(".my-weather");
const current_weather = document.querySelector(".current-weather");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
async function getMyWeather(lat, lon) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const myWeather = await data.json();
    console.log(myWeather);
    const currentWeather = temperatureConverter(myWeather.main.temp);
    current_weather.innerHTML += ": " + currentWeather;
    sunrise.innerHTML += ": " + getUTCtimeStamp(myWeather.sys.sunrise);
    sunset.innerHTML += ": " + getUTCtimeStamp(myWeather.sys.sunset);
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
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
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
window.onload = geoFindMe();
