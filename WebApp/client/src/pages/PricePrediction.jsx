import React, { useState, useEffect } from "react";
import Select from "react-select";
import lahore_locations from "../components/locations/lahore_locations";
import karachi_locations from "../components/locations/karachi_locations";
import islamabad_locations from "../components/locations/islamabad_locations";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const PricePrediction = () => {
  const [price, setPrice] = useState(0);
  const [formDetails, setFormDetails] = useState({
    property_type: "House",
    city: "Islamabad",
    location: "",
    baths: 1,
    bedrooms: 1,
    purpose: "For Sale",
    area_in_marlas: 1,
  });
  const [options, setOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const locationMap = {
    Islamabad: islamabad_locations,
    Lahore: lahore_locations,
    Karachi: karachi_locations,
  };

  const historicalValues = [
    177.94, // Jan 2019
    205.23, // Jul 2019
    206.26, // Jan 2020
    209.47, // Jul 2020
    220.13, // Jan 2021
    217.5, // Jul 2021
    241.19, // Jan 2022
    247.63, // Jul 2022
    273.87, // Jan 2023
    364.04, // Jul 2023
    355.9, // Jan 2024
    357.4, // Jul 2024
    372.6, // Now
  ];

  const months = [
    "Jan 2019",
    "Jul 2019",
    "Jan 2020",
    "Jul 2020",
    "Jan 2021",
    "Jul 2021",
    "Jan 2022",
    "Jul 2022",
    "Jan 2023",
    "Jul 2023",
    "Jan 2024",
    "Jul 2024",
    "Now",
  ];

  useEffect(() => {
    const locations = locationMap[formDetails.city].map((loc) => ({
      value: loc,
      label: loc,
    }));
    setOptions(locations);
    setSelectedLocation(null);
    setFormDetails((prev) => ({ ...prev, location: "" }));
  }, [formDetails.city]);

  const predictPrice = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/modelsapi/predict-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDetails),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const predictedPrice = data.predicted_price;
      setPrice(predictedPrice);
      setShowGraph(true);
    } catch (error) {
      console.error(error);
      setPrice(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setFormDetails((prev) => ({ ...prev, [name]: value, location: "" }));
    } else {
      setFormDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    setFormDetails((prev) => ({
      ...prev,
      location: selectedOption ? selectedOption.value : "",
    }));
  };

  const graphData = {
    labels: months,
    datasets: [
      {
        label: "Predicted Price",
        data: historicalValues.map(
          (value) => (price * value) / historicalValues[0]
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3,
      },
    ],
  };

  const option = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(
              2
            )} Rs`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)", // Light grid lines
        },
        ticks: {
          color: "#333",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#333",
          font: {
            size: 12,
          },
          // beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Price Prediction
      </h1>

      {!showGraph ? (
        <form className="space-y-6" onSubmit={predictPrice}>
          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="propertyType"
              className="text-lg font-medium text-gray-700"
            >
              Property Type
            </label>
            <select
              name="property_type"
              id="propertyType"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              value={formDetails.property_type}
            >
              <option value="House">House</option>
              <option value="Flat">Flat</option>
            </select>
          </div>

          {/* City Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="city" className="text-lg font-medium text-gray-700">
              City
            </label>
            <select
              name="city"
              id="city"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              value={formDetails.city}
            >
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
            </select>
          </div>

          {/* Location Selection */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="location"
              className="text-lg font-medium text-gray-700"
            >
              Location
            </label>
            <Select
              name="location"
              options={options}
              onChange={handleChange}
              isClearable
              isSearchable
              placeholder="Select a location..."
              value={selectedLocation}
              required
            />
          </div>

          {/* Baths Selection */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="baths"
              className="text-lg font-medium text-gray-700"
            >
              Baths
            </label>
            <select
              name="baths"
              id="baths"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              value={formDetails.baths}
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms Selection */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="bedrooms"
              className="text-lg font-medium text-gray-700"
            >
              Bedrooms
            </label>
            <select
              name="bedrooms"
              id="bedrooms"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              value={formDetails.bedrooms}
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose Selection */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="purpose"
              className="text-lg font-medium text-gray-700"
            >
              Purpose
            </label>
            <select
              name="purpose"
              id="purpose"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              value={formDetails.purpose}
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>

          {/* Area Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="area" className="text-lg font-medium text-gray-700">
              Area (Marla)
            </label>
            <input
              type="number"
              name="area_in_marlas"
              id="area"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              min="1"
              value={formDetails.area_in_marlas}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Predict
          </button>
        </form>
      ) : (
        <div>
          <div className="h-96 mb-6 w-full">
            <Line data={graphData} options={option} />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-gray-800">Predicted Price</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2 mb-2">
              {price > 0
                ? `${((price * 372.6) / 177.94).toFixed(2).toLocaleString()} Rs`
                : "N/A"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowGraph(false);
              setFormDetails({
                property_type: "House",
                city: "Islamabad",
                location: "",
                baths: 1,
                bedrooms: 1,
                purpose: "For Sale",
                area_in_marlas: 1,
              });
              setSelectedLocation(null);
            }}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Predict Another Price
          </button>
        </div>
      )}
    </div>
  );
};

export default PricePrediction;
