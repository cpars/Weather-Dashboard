import dotenv from 'dotenv';
dotenv.config();
//  Define a class for the Weather object
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
//  Complete the WeatherService class
class WeatherService {
    constructor() {
        this.cityName = '';
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
    }
    //  Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            const response = await fetch(query);
            const locationData = await response.json();
            return locationData[0];
        }
        catch (error) {
            console.log(error);
        }
    }
    //  Create destructureLocationData method
    destructureLocationData(locationData) {
        const { lat, lon } = locationData;
        const coordinates = { lat, lon };
        return coordinates;
    }
    //  Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
    }
    //  Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    //  Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
        const coordinates = this.destructureLocationData(locationData);
        return coordinates;
    }
    //  Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        return await response.json();
        //console.log(weatherData);
    }
    //  Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const { city, list } = response;
        const { dt, weather, main, wind } = list[0]; // Current weather is usually the first entry
        const date = new Date(dt * 1000).toLocaleDateString();
        const icon = weather[0].icon;
        const iconDescription = weather[0].description;
        // Convert temperature to Fahrenheit
        const tempF = ((main.temp - 273.15) * 9) / 5 + 32;
        const windSpeed = wind.speed;
        const humidity = main.humidity;
        return new Weather(city.name, date, icon, iconDescription, tempF, windSpeed, humidity);
    }
    //  Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const dailyData = weatherData.filter((item) => item.dt_txt.includes("12:00:00"));
        const forecastArray = dailyData.map((data) => {
            const { dt, weather, main, wind } = data;
            const date = new Date(dt * 1000).toLocaleDateString();
            const icon = weather[0].icon;
            const iconDescription = weather[0].description;
            const tempF = main.temp;
            const windSpeed = wind.speed;
            const humidity = main.humidity;
            return new Weather(currentWeather.city, date, icon, iconDescription, tempF, windSpeed, humidity);
        });
        return forecastArray;
    }
    //  Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        //console.log(coordinates);
        const weatherData = await this.fetchWeatherData(coordinates);
        //return weatherData;
        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
        return forecastArray;
    }
}
export default new WeatherService();
