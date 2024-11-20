import fs from "fs/promises";
//import path from 'path';

//const historyFilePath = path.resolve('server/db/db.json');
// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = "./db/db.json";

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: string[]) {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    try {
      const cities = await this.read();
      return cities.map((city: any) => new City(city.id, city.name)); // Create City instances
    } catch (error) {
      console.error("Error getting cities:", error);
      throw error;
    }
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(city: string) {
    const cities = await this.read();
    if (!cities.includes(city)) {
      cities.push({ name: city, id: Date.now().toString() });
      await this.write(cities);
    }
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  public async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter((c: any) => c.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
