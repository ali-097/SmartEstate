import React from "react";
import { useState } from "react";

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

  const predictPrice = async (e) => {
    e.preventDefault();
    console.log(formDetails);
    const response = await fetch("http://localhost:5000/predict-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDetails),
    });
    const data = await response.json();
    console.log(data);
    setPrice(data.predicted_price);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormDetails({ ...formDetails, [name]: Number(value) });
    } else {
      setFormDetails({ ...formDetails, [name]: value });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Price Prediction
      </h1>
      <form className="space-y-6" onSubmit={predictPrice}>
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
            onChange={handleChange}
            value={formDetails.property_type}
          >
            <option value="house">House</option>
            <option value="flat">Flat</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-lg font-medium text-gray-700">
            City
          </label>
          <select
            name="city"
            id="city"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formDetails.city}
          >
            <option value="islamabad">Islamabad</option>
            <option value="lahore">Lahore</option>
            <option value="karachi">Karachi</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="location"
            className="text-lg font-medium text-gray-700"
          >
            Location
          </label>
          <input
            list="locations"
            name="location"
            id="location"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formDetails.location}
            required
          />
          <datalist id="locations">
            <option value="G-13" />
            {/* Add more options here if needed */}
          </datalist>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="baths" className="text-lg font-medium text-gray-700">
            Baths
          </label>
          <select
            name="baths"
            id="baths"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formDetails.baths}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
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
            onChange={handleChange}
            value={formDetails.bedrooms}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
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
            onChange={handleChange}
            value={formDetails.purpose}
          >
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="area" className="text-lg font-medium text-gray-700">
            Area (Marla)
          </label>
          <input
            type="number"
            name="area_in_marlas"
            id="area"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
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
      <div className="mt-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Predicted Price</h2>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {price !== undefined ? `${price.toLocaleString()} Rs` : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default PricePrediction;
