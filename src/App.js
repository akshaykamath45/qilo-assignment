import "./App.css";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { sampleData } from "./sampleData";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import AverageWeatherCard from "./components/AverageWeatherCard";
import BarChart from "./components/BarChart";
import axios from "axios";
import Papa from "papaparse";

function App() {
  const sampleAverageData = {
    avgTemp: null,
    avgHumidity: null,
    avgPrecipitation: null,
  };
  const [cityName, setCityName] = useState("Mumbai");
  const [inputCityName, setInputCityName] = useState("");
  const [data, setData] = useState(sampleData);
  const [averageWeatherData, setAverageWeatherData] =
    useState(sampleAverageData);
  const [isLoading, setIsLoading] = useState(false);
  const [temperatureData, setTemperatureData] = useState([]);

  const toast = useToast();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

  const getWeatherData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const responseData = await response.json();
      if (response.status === 200) {
        console.log(`data fetched for city ${cityName} `, responseData);
        setData(responseData);
        await fetchAndCalculateAverages();
        setIsLoading(false);
        toast({
          title: `Data fetched for city ${cityName}`,
          status: "success",
          isClosable: true,
        });
      } else {
        console.log(`data cannot be fetched for ${cityName}`);
        toast({
          title: `City ${cityName} not found`,
          status: "error",
          isClosable: true,
        });
        setIsLoading(false);
      }
    } catch (e) {
      console.log("Error fetching data from server ", e);
      setIsLoading(false);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInputCityName(value);
  };

  const handleSearch = (e) => {
    if (inputCityName.length === 0) {
      toast({
        title: `Enter city name`,
        status: "error",
        isClosable: true,
      });
    } else {
      setCityName(inputCityName);
      setInputCityName("");
    }
    console.log("inside on click of search button");
    console.log("input search city name : ", inputCityName);
  };

  const fetchAndCalculateAverages = async () => {
    const today = new Date();
    const eightDaysAgo = new Date();
    const oneDayAgo = new Date();
    eightDaysAgo.setDate(today.getDate() - 8);
    oneDayAgo.setDate(today.getDate() - 1);
    const formatDate = (date) => {
      return date.toISOString().split("T")[0] + "T00:00:00";
    };

    const startDateTime = formatDate(eightDaysAgo);
    const endDateTime = formatDate(oneDayAgo);

    const options = {
      method: "GET",
      url: "https://visual-crossing-weather.p.rapidapi.com/history",
      params: {
        startDateTime,
        aggregateHours: "24",
        location: cityName,
        endDateTime,
        unitGroup: "us",
        dayStartTime: "8:00:00",
        contentType: "csv",
        dayEndTime: "17:00:00",
        shortColumnNames: "0",
      },
      headers: {
        "X-RapidAPI-Key": `${RAPID_API_KEY}`,
        "X-RapidAPI-Host": "visual-crossing-weather.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const csvData = response.data;

      Papa.parse(csvData, {
        header: true,
        complete: function (results) {
          const data = results.data;

          let temperatureData = [];
          let dateTemperatureMap = {};

          data.forEach((row) => {
            if (row["Temperature"]) {
              const temperatureCelsius =
                ((parseFloat(row["Temperature"]) - 32) * 5) / 9;
              const date = row["Date time"];

              if (!dateTemperatureMap[date]) {
                dateTemperatureMap[date] = [];
              }

              dateTemperatureMap[date].push(temperatureCelsius);
            }
          });

          for (const [date, temperatures] of Object.entries(
            dateTemperatureMap
          )) {
            const avgTemperature =
              temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
            temperatureData.push({
              date: date,
              temperature: avgTemperature,
            });
          }

          setTemperatureData(temperatureData);

          let totalTemperature = 0;
          let totalHumidity = 0;
          let totalPrecipitation = 0;
          let daysCount = 0;

          data.forEach((row) => {
            if (
              row["Temperature"] &&
              row["Relative Humidity"] &&
              row["Precipitation"]
            ) {
              totalTemperature +=
                ((parseFloat(row["Temperature"]) - 32) * 5) / 9;
              totalHumidity += parseFloat(row["Relative Humidity"]);
              totalPrecipitation += parseFloat(row["Precipitation"]);
              daysCount++;
            }
          });

          const avgTemp = totalTemperature / daysCount;
          const avgHumidity = totalHumidity / daysCount;
          const avgPrecipitation = totalPrecipitation / daysCount;

          setAverageWeatherData({
            avgTemp,
            avgHumidity,
            avgPrecipitation,
          });
        },
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const fetchUsersLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherDataBasedOnLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user's location ", error.message);
          toast({
            title: `Please allow location access `,
            status: "error",
            isClosable: true,
          });
        }
      );
    }
  };

  const getWeatherDataBasedOnLocation = async (latitude, longitude) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const responseData = await response.json();
      if (response.status === 200) {
        console.log(
          `data fetched for city ${responseData.name} `,
          responseData
        );
        setCityName(responseData.name);
        setData(responseData);
        await fetchAndCalculateAverages();
        setIsLoading(false);
      } else {
        console.log(`data cannot be fetched for ${responseData.name}`);
        setIsLoading(false);
      }
    } catch (e) {
      console.log("Error fetching data from server ", e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityName]);

  console.log("average weather data ", averageWeatherData);
  return (
    <div className="App">
      {isLoading ? (
        <div className="p-12">
          <SearchBar
            handleSearch={handleSearch}
            onFetchUserLocation={fetchUsersLocation}
            isLoading={isLoading}
            inputCityName={inputCityName}
            handleInput={handleInput}
          ></SearchBar>
          <h1 style={{ marginTop: "15px", fontSize: 30, color: "black" }}>
            Fetching Data
          </h1>
        </div>
      ) : (
        <div className="p-12">
          <SearchBar
            handleSearch={handleSearch}
            onFetchUserLocation={fetchUsersLocation}
            isLoading={isLoading}
            inputCityName={inputCityName}
            handleInput={handleInput}
          ></SearchBar>
          <WeatherCard data={data}></WeatherCard>
          <AverageWeatherCard data={averageWeatherData}></AverageWeatherCard>
          <BarChart temperatureData={temperatureData}></BarChart>
        </div>
      )}
    </div>
  );
}

export default App;
