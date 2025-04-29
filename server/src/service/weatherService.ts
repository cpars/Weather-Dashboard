import dotenv from 'dotenv';
dotenv.config();

//  Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

//  Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
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
  //  Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;
  
  private cityName = '';


  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    
    this.apiKey = process.env.API_KEY || '';

  }

  //  Create fetchLocationData method
  private async fetchLocationData(query: string) {
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
private destructureLocationData(locationData: Coordinates): Coordinates {
  const { lat, lon } = locationData;
  const coordinates: Coordinates = { lat, lon };
  return coordinates;
}
  
//  Create buildGeocodeQuery method
private buildGeocodeQuery(): string {
  return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`;
}
  //  Create buildWeatherQuery method
private buildWeatherQuery(coordinates: Coordinates): string {
  return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
}
  //  Create fetchAndDestructureLocationData method
private async fetchAndDestructureLocationData() {
  const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
  const coordinates = this.destructureLocationData(locationData);
  return coordinates;
}
  //  Create fetchWeatherData method
private async fetchWeatherData(coordinates: Coordinates) {
  const response = await fetch(this.buildWeatherQuery(coordinates));
  return await response.json();
  //console.log(weatherData);
}
  //  Build parseCurrentWeather method
private parseCurrentWeather(response: any) {
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
private buildForecastArray(currentWeather: Weather, weatherData: any[]) {

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
  async getWeatherForCity(city: string) {
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
