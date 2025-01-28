// Setting up variables
let cityInput = document.getElementById("city");
let systemInput;
let infoDiv = document.getElementById("info");
let infoDiv2 = document.getElementById("info2");

// API variables
const searchButton = document.getElementById("search");
const key = "d89bc06956c9342887b278524be94f53";
const imgUrl = "http://openweathermap.org/img/wn";

// Show data in the div
let info_city = document.getElementById("info_city");
let info_country = document.getElementById("info_country");
let info_current_weather = document.getElementById("info_current_weather");
let info_lat;
let info_lon;
let table_day;
let table_temp_min;
let table_temp_max;
let table_weather;

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
let date = new Date();
console.log(date);

// add Action on the button
searchButton.addEventListener("click", () => {
  cityInput = document.getElementById("city").value;
  if (cityInput.length == 0) {
    alert("Please insert a city name");
  } else {
    systemInput = document.querySelector('input[name="system"]:checked').value;
    weatherRequest();
  }
});

// Quick Fetch function
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

// First Fetch by city input
function weatherRequest() {
  fetchData(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${key}`
  )
    .then((data) => basicData(data))
    .catch(notFound);
}
// Display all in web
function basicData(data) {
  info_city.textContent = `City: ${data.name}`;
  info_country.textContent = `Country: ${data.sys.country}`;
  info_current_weather.textContent = `Current weather: ${data.weather[0].description}`;
  info_lat = data.coord.lat;
  info_lon = data.coord.lon;
  weatherRequestForecast();
}
// Second Fetch with longtitude and latitude from Fetch#1
async function weatherRequestForecast() {
  await fetchData(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${info_lat}&lon=${info_lon}&units=${systemInput}&appid=${key}`
  ).then((data) => tableData(data));
}

//  Displaying data in web
function tableData(data) {
  const symbol = systemInput === "imperial" ? " F" : "°C";
  table_object = data.list.map(
    (item, i) =>
      `<tr>
      <td>${date.addDays(i).toLocaleString().split(",")[0]}</td>
      <td>${Math.round(item.main.temp_min)}${symbol}</td>
      <td>${Math.round(item.main.temp_max)}${symbol}</td>
      <td> <img src="${imgUrl}/${item.weather[0].icon}@2x.png"
      title ="${item.weather[0].description}"></th>
    </tr>`
  );
  // Create table
  const table = `
  <table class="table bg-dark text-white">
  <thead><h2>Next 7 day's Forecast<h2></thead>
  <tbody>
  <th>Day</th>
  <th>Temp min</th>
  <th>Temp max</th>
  <th>Weather</th>
    ${table_object.join("")}
    </tbody>
  </table>`;

  infoDiv2.innerHTML = table;
}

// Catch error
function notFound(error) {
  var info = document.getElementById("info");
  // console.log(err);
  var newHTML = `<h1>City not found</h1> <p>${error}</p>`;
  info.innerHTML = newHTML;
}
