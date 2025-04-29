import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
//  POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    //  GET weather data from city name
    //  save city to search history
    try {
        const city = req.body.cityName;
        const weather = await WeatherService.getWeatherForCity(city);
        HistoryService.addCity(city);
        return res.json(weather);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});
//  GET search history
router.get('/history', async (_req, res) => {
    try {
        const savedCities = await HistoryService.getCities();
        res.json(savedCities);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
// * BONUS  DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ msg: 'City id is required' });
        }
        await HistoryService.removeCity(req.params.id);
        res.json({ success: 'City successfully removed from search history' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
export default router;
