'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cityData = require('./data/weather.json');

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

class Forecast {
  constructor(date, description){
    this.date = date;
    this.description = description;
  }
}

app.get('/weather', (req, res) => {
  // Extract latitude, longitude, and searchQuery from query parameters
  const { lat, lon, searchQuery } = req.query;

  // Check if the provided lat and lon are valid numbers
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude values' });
  }

  const matchingCity = cityData.find((city) => city.name.toLowerCase() === searchQuery.toLowerCase());

  if (!matchingCity) {
    return res.status(404).json({ error: 'City not found' });
  }

  // Use the lat and lon values of the matching city
  const matchedLat = matchingCity.lat;
  const matchedLon = matchingCity.lon;

  // Find weather data based on matchedLat and matchedLon
  const weatherData = findWeatherData(matchedLat, matchedLon);

  if (!weatherData) {
    return res.status(404).json({ error: 'Weather data not found' });
  }

  // Create an array of Forecast objects from the weather data
  const forecasts = weatherData.map((item) => {
    return new Forecast(item.datetime, item.weather.description);
  });

  res.json(forecasts);
});








app.listen(PORT, () => {
  console.log('listening');
});
