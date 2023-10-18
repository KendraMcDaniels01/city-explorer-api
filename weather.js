const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

async function getWeather(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon || isNaN(lat) || isNaN(lon) || !WEATHER_API_KEY) {
    return res.status(400).json({ error: 'Invalid request or missing API key' });
  }

  try {
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`
    );

    const weatherData = weatherResponse.data;

    if (!weatherData.city_name) {
      return res.status(404).json({ error: 'City not found' });
    }

    const forecasts = weatherData.data.map((item) => {
      return new Forecast(item.datetime, item.weather.description);
    });

    res.json(forecasts);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
}

module.exports = { getWeather };
