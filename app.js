const express = require("express");
const axios = require("axios");
const path = require("path");
import("node-fetch");

const app = express();
const port = 3000;

const apiKey = "ace1ffcc9ac4cab7456a6d14fdc483e7";
const nasaApodApiKey = "Rreq2D2tsHmKYfBdxoeEa5m48d1Fc15YUIgFfXOu";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/apod", async (req, res) => {
  try {
    // Get astronomy picture of the day from NASA APOD API
    const apodResponse = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${nasaApodApiKey}`
    );
    const apodData = await apodResponse.json();
    res.json(apodData);
  } catch (error) {
    console.error("Error fetching APOD data", error);
    res.status(500).send("Error fetching APOD data");
  }
});

app.get("/country/:code", async (req, res) => {
  const { code } = req.params;

  try {
    // Get country information from REST Countries API
    const countryResponse = await axios.get(
      `https://restcountries.com/v3/alpha/${code}`
    );
    const countryData = countryResponse.data[0];
    res.json(countryData);
  } catch (error) {
    console.error("Error fetching country data", error);
    res.status(500).send("Error fetching country data");
  }
});

app.get("/map", async (req, res) => {
  const cityName = req.query.city; // Extract city parameter from URL

  if (!cityName) {
    return res.send(
      "Please provide a city parameter in the URL, e.g., /map?city=London"
    );
  }

  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    const cityData = {
      name: cityName,
      temperature: weatherData.main.temp - 273.15,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      coordinates: {
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      feelsLike: weatherData.main.feels_like - 273.15,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: weatherData.wind.speed,
      country: weatherData.sys.country,
      rainVolumeLast3Hours: weatherData.hasOwnProperty("rain")
        ? weatherData.rain["3h"] || 0
        : 0,
    };

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>City Map</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
          <link
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          rel="stylesheet"
        />
          <style>
          /* Additional Custom Styles */
          body {
            padding-top: 56px; /* Height of fixed navbar */
            margin-bottom: 60px; /* Height of fixed footer */
          }
          #apod-image {
            height: 400px;
          }
          #map {
            height: 400px;
          }
          /* Custom styles for small screens */
          @media (max-width: 576px) {
            body {
              padding-top: 0;
            }
          }
          /* Custom Footer Styles */
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: #f8f9fa;
            text-align: center;
            padding: 10px;
          }
        </style>
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
          <a class="navbar-brand" href="/">City Map</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="/map?city=Karaganda">Karaganda</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/map?city=Astana">Astana</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/map?city=Almaty">Almaty</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
          <div class="container mt-4 ">
          <!-- City Map Content -->
          <h1 class="mb-4">City Map - ${cityData.name}</h1>
          
          <!-- Search Form -->
    <form id="searchForm" class="mb-3">
      <div class="input-group">
        <input type="text" class="form-control" id="cityInput" placeholder="Enter a city name">
        <div class="input-group-append">
          <button class="btn btn-primary" type="submit">Search</button>
        </div>
      </div>
    </form>
    <h2>Country Information</h2>
      <p id="country-name"></p>
      <p id="country-capital"></p>
      <p id="country-population"></p>
          <div id="map"></div>
        </div>
        <div class="container mt-4">
        
      <div class="row justify-content-md-center">
      <h2>Astronomy Picture of the Day</h2>
      </div>
          
          <div class="row justify-content-md-center">
          <img id="apod-image" class="rounded-circle" src="" alt="APOD" />
          </div>
          <p id="apod-title"></p>
          <p id="apod-explanation"></p>
      
        </div>
        <footer class="footer mt-5 bg-info">
      <div class="container">
        <p>Popov Artem | SE-2205</p>
      </div>
    </footer>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
          <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
          <script>
            const city = ${JSON.stringify(cityData)};
            
            const map = L.map('map').setView([city.coordinates.lat, city.coordinates.lon], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            const marker = L.marker([city.coordinates.lat, city.coordinates.lon]).addTo(map);
            marker.bindPopup(\`
              <b>\${city.name}</b><br>
              Temperature: \${city.temperature.toFixed(0)}°C<br>
              Description: \${city.description}<br>
              Icon: <img src="http://openweathermap.org/img/wn/\${city.icon}.png"><br>
              Coordinates: Lat \${city.coordinates.lat}, Lon \${city.coordinates.lon}<br>
              Feels Like: \${city.feelsLike.toFixed(0)}°C<br>
              Humidity: \${city.humidity}%<br>
              Pressure: \${city.pressure} hPa<br>
              Wind Speed: \${city.windSpeed} m/s<br>
              Country Code: \${city.country}<br>
              Rain Volume (last 3 hours): \${city.rainVolumeLast3Hours} mm
            \`).openPopup();
            // JavaScript Code for City Search
            document.getElementById('searchForm').addEventListener('submit', function(event) {
              event.preventDefault();
              const cityInput = document.getElementById('cityInput').value.trim();
              if (cityInput !== '') {
                const encodedCity = encodeURIComponent(cityInput);
                const mapUrl = "/map?city=" + encodedCity;
                window.open(mapUrl, "_self");
              }
            });
            async function getApodData() {
              try {
                const response = await fetch("/apod");
                const data = await response.json();
      
                // Update the HTML with APOD information
                document.getElementById("apod-image").src = data.url;
                document.getElementById("apod-title").innerText = data.title;
                document.getElementById("apod-explanation").innerText =
                  data.explanation;
              } catch (error) {
                console.error("Error fetching APOD data", error);
              }
            }
      
            // Function to fetch Country information
            async function getCountryData(countryCode) {
              try {
                const response = await fetch("/country/" + countryCode);
                const data = await response.json();
      
                // Update the HTML with country information
                document.getElementById(
                  "country-name"
                ).innerText = "Name: " + data.name.common;
                document.getElementById(
                  "country-capital"
                ).innerText = "Capital: " + data.capital;
                document.getElementById(
                  "country-population"
                ).innerText = "Population: " + data.population;
              } catch (error) {
                console.error("Error fetching country data", error);
              }
            }
      

            getCountryData(city.country);
            getApodData();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    res.send(`Error fetching weather data for ${cityName}: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
