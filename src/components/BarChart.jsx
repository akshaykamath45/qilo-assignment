import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ temperatureData }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: temperatureData.map((data) => data.date),
          datasets: [
            {
              label: "Temperature",
              data: temperatureData.map((data) => data.temperature),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Temperature (°C)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
          },
        },
      });
    }
  }, [temperatureData]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
