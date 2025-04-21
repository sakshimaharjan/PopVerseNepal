import { PolarArea } from "react-chartjs-2"
import { Chart, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js"

// Register necessary Chart.js components
Chart.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const PolarChart = ({ data = null, options = {} }) => {
  // Default data if none provided
  const defaultData = {
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
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
  }

  const chartData = data || defaultData
  const chartOptions = { ...defaultOptions, ...options }

  return (
    <div className="w-full h-full">
      <PolarArea data={chartData} options={chartOptions} />
    </div>
  )
}

export default PolarChart
