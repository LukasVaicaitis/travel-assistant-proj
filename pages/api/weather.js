import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

// Koordinates pagal miesto pavadinima
export const fetchCoordinates = async (city) => {
    if (!city || city.trim() === "") {
      console.error("Invalid city name");
      return null;
    }
    try {
      const { data } = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      
      if (data.length === 0) {
        console.error("City not found");
        return null;  // Return null if no results are found
      }
  
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
      return null;  // Return null on error to avoid breaking the application
    }
  };

// Dabartinis oras pagal koordinates
export const fetchCurrentWeather = async (lat, lon) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    return data;
  } catch (error) {
    console.error("Klaida gaunant oru duomenis:", error);
    return null;
  }
};

// 5d oru prognoze pagal miesto koordinates
export const fetchWeatherForecast = async (lat, lon) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    return data;
  } catch (error) {
    console.error("Klaida gaunant oru duomenis:", error);
    return null;
  }
};