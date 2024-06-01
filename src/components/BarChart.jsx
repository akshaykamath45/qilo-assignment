// /src/components/BarChart.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ temperatureData }) => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // destroying existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // new chart instance
      chartInstanceRef.current = new Chart(ctx, {
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

    // cleanup function to destroy chart instance when component unmounts or before re-creating it
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [temperatureData]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
