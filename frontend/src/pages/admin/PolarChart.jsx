import React from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
Chart.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarChart = () => {
  const data = {
    labels: ["Spider-Man", "Iron Man", "Captain America", "Thor", "Hulk"], // Marvel character categories
    datasets: [
      {
        label: "Funko Pop Sales",
        data: [500, 400, 350, 300, 450], // Dummy sales data (number of Funko Pops sold)
        backgroundColor: [
          "rgba(255, 99, 132, 0.9)", // Spider-Man
          "rgba(75, 192, 192, 0.9)", // Iron Man
          "rgba(255, 205, 86, 0.9)", // Captain America
          "rgba(201, 203, 207, 0.9)", // Thor
          "rgba(54, 162, 235, 0.9)", // Hulk
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    };

  return (
    <div className="flex m-5">
      <div className="bg-white p-6 rounded-4xl shadow-2xl w-96">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Marvel Funko Pop Sales by Character
        </h2>
        <div className="relative w-full h-80">
          <PolarArea data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PolarChart;