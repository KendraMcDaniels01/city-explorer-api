'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT;

const app = express();
app.use(cors());


app.use(cors());

const { getWeather } = require('./weather');
const { getMovies } = require('./movies');

app.get('/weather', getWeather);
app.get('/movies', getMovies);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
