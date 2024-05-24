import React from "react";
import { Title } from "@tremor/react";
import "./WeatherCard.css";

const AverageWeatherCard = ({ data }) => {
  return (
    <main className="p-12">
      <Title style={{ color: "black", marginBottom: "15px" }}>
        Weather Data for the Past 7 Days
      </Title>

      <div className="averages">
        <div className="card">
          Avg Temp:{" "}
          {data.avgTemp !== null ? `${data.avgTemp.toFixed(2)}°C` : "N/A"}
        </div>
        <div className="card">
          Avg Rainfall:{" "}
          {data.avgPrecipitation !== null
            ? `${data.avgPrecipitation.toFixed(2)} mm`
            : "N/A"}
        </div>
        <div className="card">
          Avg Humidity:{" "}
          {data.avgHumidity !== null
            ? `${data.avgHumidity.toFixed(2)}%`
            : "N/A"}
        </div>
      </div>
    </main>
  );
};

export default AverageWeatherCard;
