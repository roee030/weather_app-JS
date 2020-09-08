let myLatitude = "";
let myLongitude = "";
const apiKey = "61fed7decd915f9b031fb5a73d66db0c";
const status = document.querySelector("#status");
const mapLink = document.querySelector("#map-link");
const my_weather = document.querySelector(".my-weather");
async function getMyWeather(lat, lon) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const myWeather = await data.json();
    console.log(myWeather);
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
window.onload = geoFindMe();
