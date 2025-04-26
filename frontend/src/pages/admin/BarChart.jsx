import { Bar } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({ data = null, options = {} }) => {
  // Default data if none provided
  const defaultData = {
    labels: ["Deadpool", "Black Panther", "Wolverine", "Doctor Strange", "Ant-Man"], // Marvel character categories
    datasets: [
      {
        label: "Funko Pop Sales by Character",
        data: [150, 220, 180, 250, 210], // Updated sales data (number of Funko Pops sold)
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(255, 159, 64, 0.6)", // Orange
          "rgba(54, 162, 235, 0.6)", // Blue
        ], // Different colors for each bar
        borderColor: [
          "rgba(255, 99, 132, 1)", // Red
          "rgba(75, 192, 192, 1)", // Green
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(255, 159, 64, 1)", // Orange
          "rgba(54, 162, 235, 1)", // Blue
        ], // Border colors corresponding to each bar
        borderWidth: 1, // Border width
      },
    ],
  }

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Hide the x-axis grid lines for a cleaner look
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50, // Custom step size for the y-axis ticks
        },
        grid: {
          display: true,
        },
      },
    },
  }

  const chartData = data || defaultData
  const chartOptions = { ...defaultOptions, ...options }

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  )
}

export default BarChart
