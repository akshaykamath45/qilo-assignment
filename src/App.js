import "./App.css";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { sampleData } from "./sampleData";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";

function App() {
  const [cityName, setCityName] = useState("Mumbai");
  const [inputCityName, setInputCityName] = useState("");
  const [data, setData] = useState(sampleData);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const API_KEY = process.env.REACT_APP_API_KEY;

  // fetching using city name
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
    }
  };

  // fetching using user's geographic location
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
        setIsLoading(false);
      } else {
        console.log(`data cannot be fetched for ${responseData.name}`);
      }
    } catch (e) {
      console.log("Error fetching data from server ", e);
    }
  };

  useEffect(() => {
    getWeatherData();
    // the below line will make sure,getWeatherData() does not have to be included as dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityName, setCityName]);

  const handleInput = (e) => {
    const value = e.target.value;

    setInputCityName(value);
  };

  const handleSearch = (e) => {
    if (inputCityName.length === 0) {
      toast({
        title: `Minimum character should be 1`,
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
  // console.log("final data object : ", data);

  return (
    <div className="App">
      {isLoading === true ? (
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
        </div>
      )}
    </div>
  );
}

export default App;
