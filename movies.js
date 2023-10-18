const axios = require('axios');
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const cache = {};
const CACHE_EXPIRATION_TIME = 600000; // 10 minutes in milliseconds


class Movie {
  constructor(title, release, overview) {
    this.title = title;
    this.release = release;
    this.overview = overview;
  }
}

async function getMovies(req, res) {
  const { searchQuery } = req.query;

  if (!searchQuery || !MOVIE_API_KEY) {
    return res.status(400).json({ error: 'Invalid request or missing API key' });
  }

  const cacheKey = searchQuery.toLowerCase();

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_EXPIRATION_TIME) {

    res.json(cache[cacheKey].data);
  } else {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&api_key=${MOVIE_API_KEY}`
      );

      const movieData = response.data;

      const movies = movieData.results.map((item) => {
        return new Movie(item.title, item.release_date, item.overview);
      });

      cache[cacheKey] = { data: movies, timestamp: Date.now() };

      res.json(movies);

    } catch (error) {
      console.error('Error fetching movie data:', error);
      res.status(500).json({ error: 'Failed to retrieve movie data' });
    }
  }
}
module.exports = { getMovies };
