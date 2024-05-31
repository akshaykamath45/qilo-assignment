import React from "react";
import { Title } from "@tremor/react";
import "./WeatherCard.css";

const AverageWeatherCard = ({ data }) => {
  return (
    <div className="p-12">
      <Title style={{ color: "black", marginBottom: "15px" }}>
        Weather Data for the Past 7 Days
      </Title>

      <div
        className="averages"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="card">
          Average Temperature:{" "}
          {data.avgTemp !== null ? `${data.avgTemp.toFixed(2)}°C` : "N/A"}
        </div>
        <div className="card">
          Average Rainfall:{" "}
          {data.avgPrecipitation !== null
            ? `${data.avgPrecipitation.toFixed(2)} mm`
            : "N/A"}
        </div>
        <div className="card">
          Average Humidity:{" "}
          {data.avgHumidity !== null
            ? `${data.avgHumidity.toFixed(2)}%`
            : "N/A"}
        </div>
      </div>
    </div>
  );
};

export default AverageWeatherCard;
