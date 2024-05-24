import React from "react";
import { Card, Text, Grid, Title, Col } from "@tremor/react";
import sunrise from "../assets/sunrise.png";
import sunset from "../assets/sunset.png";
import "./WeatherCard.css";

export const WeatherCard = ({ data }) => {
  const baseUrl = "https://openweathermap.org/img/wn/";
  const sunriseTime = new Date(data.sys.sunrise * 1000); // convert seconds to milliseconds
  const sunsetTime = new Date(data.sys.sunset * 1000); // convert seconds to milliseconds

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="p-12">
      <Title style={{ color: "black", marginBottom: "15px" }}>
        Weather Data for {`${data.name}`}
      </Title>

      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
        <Col numColSpan={1} numColSpanLg={2}>
          <Card>
            <Title>Location</Title>
            <Text> {data.name}</Text>
            <Text>Country {data.sys.country}</Text>
            <Text>Latitude {data.coord.lat.toFixed(2)}°</Text>
            <Text>Longitude {data.coord.lon.toFixed(2)}°</Text>
            <div className="sunrise">
              <img
                src={sunrise}
                alt="sunrise-img"
                style={{ width: "20px", height: "20px" }}
              ></img>
              <Text>{formatTime(sunriseTime)}</Text>
            </div>
            <div className="sunset">
              <img
                src={sunset}
                alt="sunset-img"
                style={{ width: "20px", height: "20px" }}
              ></img>
              <Text>{formatTime(sunsetTime)}</Text>
            </div>
          </Card>
        </Col>
        <Card>
          <Title>Weather Condition</Title>
          {data.weather.map((elements, index) => (
            <div key={index}>
              <Title>
                {elements.description.charAt(0).toUpperCase() +
                  elements.description.slice(1)}
              </Title>

              <Title>
                <img
                  src={`${baseUrl}${elements.icon}@2x.png`}
                  alt="Weather Icon"
                />
              </Title>
            </div>
          ))}
        </Card>
        <Col>
          <Card>
            <Title>Temperature</Title>
            <Text>Current Temperature {data.main.temp} °C</Text>
            <Text>Feels Like {data.main.feels_like} °C</Text>
            <Text>Min Temperature {data.main.temp_min} °C</Text>
            <Text>Max Temperature {data.main.temp_max} °C</Text>
          </Card>
        </Col>
        <Card>
          <Title>Atmospheric Conditions</Title>
          <Text>Pressure {data.main.pressure} hPa</Text>
          <Text>Humidity {data.main.humidity}%</Text>
        </Card>
        <Card>
          <Title>Wind and Visibility</Title>
          <Text>Wind Speed {data.wind.speed} m/s</Text>
          <Text>Wind Direction {data.wind.deg}°</Text>
          <Text>Visibility {data.visibility} meters</Text>
        </Card>
      </Grid>
    </main>
  );
};

export default WeatherCard;
