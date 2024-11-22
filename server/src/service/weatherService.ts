import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  city: string;
  date: string;
  temp: number;
  wind: number;
  humidity: number;
  description: string;
  icon: string;
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL!;
  private apiKey = process.env.API_KEY!;

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(
    city: string
  ): Promise<Coordinates> {
    console.log(this.buildGeocodeQuery(city));
    const response = await axios.get(this.buildGeocodeQuery(city));
    if (response.data.length === 0) {
      throw new Error(`City "${city}" not found`);
    }
    return this.destructureLocationData(response.data[0]);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData({ lat, lon }: Coordinates) {
    console.log(lat, lon);
    const url = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
    const response = await axios.get(url);
    return response.data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(data: any): Weather {
    const { name: city } = data.city;
    const {
      dt_txt,
      main: { temp, humidity },
      wind: { speed },
      weather: [{ description, icon }],
    } = data.list[0];
    const date = dt_txt.split(" ")[0]; 

    return { city, date, temp, description, icon, humidity, wind: speed };
}


  private parseForecast(data: any): Weather[] {
    return data.list
      .filter((item: any) => item.dt_txt.includes("12:00:00"))
      .map((item: any) => {
        const {
          dt_txt,
          main: { temp, humidity },
          wind: { speed },
          weather: [{ description, icon }],
        } = item;
        const date = dt_txt.split(" ")[0];
        
        return {
          city: data.city.name,
          date, 
          humidity,
          wind: speed,
          temp,
          description,
          icon,
        };
      });
  }

  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.parseForecast(weatherData);
    return { currentWeather, forecast };
  }
}

export default new WeatherService();
