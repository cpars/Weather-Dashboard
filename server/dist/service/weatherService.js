import dotenv from 'dotenv';
dotenv.config();
// Weather class with properties
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// WeatherService class with methods
class WeatherService {
    constructor() {
        this.cityName = '';
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
    }
    // fetchLocationData method to fetch location data
    async fetchLocationData(query) {
        try {
            const response = await fetch(query);
            if (!response.ok) {
                throw new Error(`Error fetching location data: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.length === 0) {
                throw new Error('No location data found for the provided city name');
            }
            return data[0];
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch location data');
        }
    }
    // destructureLocationData method to destructure location data to get latitude and longitude
    destructureLocationData(locationData) {
        const { lat, lon } = locationData;
        return { lat, lon };
    }
    // buildGeocodeQuery method to build the geocode query
    buildGeocodeQuery() {
        if (!this.cityName || !this.apiKey) {
            throw new Error('City name or API key is missing');
        }
        const query = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
        return query;
    }
    // buildWeatherQuery method to build the weather query
    buildWeatherQuery(coordinates) {
        if (!this.apiKey) {
            throw new Error('API key is missing');
        }
        const { lat, lon } = coordinates;
        const query = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;
        return query;
    }
    // fetchAndDestructureLocationData method to fetch and destructure location data using city name
    async fetchAndDestructureLocationData() {
        const query = this.buildGeocodeQuery();
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }
    // fetchWeatherData method to fetch weather data using coordinates
    async fetchWeatherData(coordinates) {
        try {
            const query = this.buildWeatherQuery(coordinates);
            const response = await fetch(query);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch weather data');
        }
    }
    // parseCurrentWeather method to parse the current weather data and return a Weather object
    parseCurrentWeather(response) {
        const { temp, humidity } = response.main;
        const { speed: windSpeed } = response.wind;
        const { description, icon } = response.weather[0];
        return new Weather(this.cityName, response.dt_txt, icon, description, temp, windSpeed, humidity);
    }
    // buildForecastArray method to build the forecast array and return the current weather and forecast
    buildForecastArray(currentWeather, weatherData) {
        let filteredDays = weatherData.filter((day) => day.dt_txt.includes('12:00:00'));
        const forecast = filteredDays.map((day) => {
            const { temp, humidity } = day.main;
            const { speed: windSpeed } = day.wind;
            const { description, icon } = day.weather[0];
            return new Weather(this.cityName, day.dt_txt, icon, description, temp, windSpeed, humidity);
        });
        return { currentWeather, forecast };
    }
    // getWeatherForCity method to get the weather for a city and return the forecast
    async getWeatherForCity(city) {
        if (!city) {
            throw new Error('City name is missing');
        }
        try {
            this.cityName = city;
            const coordinates = await this.fetchAndDestructureLocationData();
            const weatherData = await this.fetchWeatherData(coordinates);
            const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
            const forecast = this.buildForecastArray(currentWeather, weatherData.list);
            if (!currentWeather || !forecast) {
                throw new Error('Failed to parse weather data');
            }
            return forecast;
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Failed to fetch weather data');
        }
    }
}
// Export the WeatherService class so it can be used in other files
export default new WeatherService();
