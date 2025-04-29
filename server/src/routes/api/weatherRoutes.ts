import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

//  POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const city = req.body.cityName;
    if (!city) {
      return res.status(400).json({ message: 'City name is required.' });
    }

    const weather = await WeatherService.getWeatherForCity(city);

    if (!weather || weather.length === 0) {
      return res.status(404).json({ message: 'City not found. Please try again.' });
    }

    HistoryService.addCity(city);
    return res.json(weather);

  } catch (err: any) {
    console.error('Error fetching weather:', err.message || err);

    if (err.message && err.message.includes('City not found')) {
      return res.status(404).json({ message: 'City not found. Please try again.' });
    }

    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

//  GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to load search history.' });
  }
});

// * BONUS  DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: 'City id is required.' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City successfully removed from search history.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to remove city from history.' });
  }
});

export default router;
