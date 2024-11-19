import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// Get request to retrieve weather data for a city
router.get('/', async (req, res) => {
  const city = req.body.cityName as string;
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    res.json(weatherData);
  } catch (err: any) {
    throw new Error(err);
  }
});

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const city = req.body.cityName as string; 
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    res.json(weatherData);
  } catch (err: any) {
    throw new Error(err);
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities(); 
    console.log(cities);
    res.json(cities); 
  } catch (err: any) {
    throw new Error(err);
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await HistoryService.removeCity(id);
    res.sendStatus(200);
  } catch (err: any) {
    throw new Error(err);
  }
});

export default router;
