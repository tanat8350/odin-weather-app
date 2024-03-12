import { update } from 'lodash';
import './style.css';
import loadingGif from './loading.gif';

const spanCurrentLocationError = document.querySelector('.set-location-error');

async function fetchWeather(location = 'bangkok') {
  try {
    spanCurrentLocationError.textContent = '';
    const api =
      'http://api.weatherapi.com/v1/current.json?key=adb70e255ec04af8a25133111240903&q=' +
      location +
      '&aqi=no';
    const response = await fetch(api);
    const responseJson = await response.json();
    await updateCurrentWeather(responseJson);
    return responseJson;
  } catch (error) {
    spanCurrentLocationError.textContent = 'Invalid Location';
  }
}

async function fetchImg(keyword) {
  const api =
    'https://api.giphy.com/v1/gifs/translate?api_key=OfNlX8xHE17qFlmOyPVhG2PW2MPKL7rG&s=' +
    keyword;
  const response = await fetch(api);
  const responseJson = await response.json();
  return responseJson.data.images.original.url;
}

const spanCurrentLocation = document.querySelector('.current-location span');
const spanCurrentTemp = document.querySelector('.current-temp span');
const spanCurrentFeelslike = document.querySelector('.current-feelslike span');
const spanCurrentCondition = document.querySelector('.current-condition span');
const imgCondition = document.querySelector('.condition-img');

const fieldsetUnit = document.querySelector('.unit-radio');
fieldsetUnit.addEventListener('change', () => {
  fetchWeather(spanCurrentLocation.textContent);
});

const radioFahrenheit = document.querySelector('#fahrenheit');
function getCurrentUnit() {
  if (radioFahrenheit.checked) {
    return 'f';
  }

  return 'c';
}

async function updateCurrentWeather(response) {
  imgCondition.src = loadingGif;
  const unit = getCurrentUnit();
  const displayUnit = `°${unit.toUpperCase()}`;
  const currentTemp = 'temp_' + unit;
  const currentFeelslike = 'feelslike_' + unit;

  spanCurrentLocation.textContent = response.location.name;
  spanCurrentTemp.textContent = `${response.current[currentTemp]}${displayUnit}`;
  spanCurrentFeelslike.textContent = `${response.current[currentFeelslike]}${displayUnit}`;

  spanCurrentCondition.textContent = response.current.condition.text;
  imgCondition.src = await fetchImg(response.current.condition.text);
}
fetchWeather();

const inputLocation = document.querySelector('#location');
const btnLocation = document.querySelector('.set-location-btn');

function updateLocation() {
  fetchWeather(inputLocation.value);
  inputLocation.value = '';
}

btnLocation.addEventListener('click', () => {
  updateLocation();
});

inputLocation.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    updateLocation();
  }
});
