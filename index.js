'use strict';


const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const app = express();
app.use(cors());

class Forecast {
  constructor(date, description){
    this.date = date;
    this.description = description;
  }
}
class Movie {
  constructor(title, release, overview){
    this.title = title;
    this.release = release;
    this.overview = overview;
  }
}

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon || isNaN(lat) || isNaN(lon || !WEATHER_API_KEY)) {
    return res.status(400).json({ error: 'Invalid request or missing API key' });
  }

  try {
    // Use Axios to make an API request for weather data
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`
    );

    // Extract the weather data from the response
    const weatherData = weatherResponse.data;

    // Check if the data contains information about the requested city
    if (!weatherData.city_name) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Create an array of Forecast objects from the weather data
    const forecasts = weatherData.data.map((item) => {
      return new Forecast(item.datetime, item.weather.description);
    });

    res.json(forecasts);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

app.get('/movies', async (req, res) => {
  const { searchQuery } = req.query;

  if (!searchQuery || !MOVIE_API_KEY) {
    return res.status(400).json({ error: 'Invalid request or missing API key' });
  }

  try {
    // Use Axios to make an API request to TMDb
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${MOVIE_API_KEY}`
    );

    // Extract movie data from the response
    const movieData = response.data;

    // Create an array of movie objects
    const movies = movieData.map((item) => {
      return new Movie (item.title,item.release_date,item.overview);
    });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).json({ error: 'Failed to retrieve movie data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


