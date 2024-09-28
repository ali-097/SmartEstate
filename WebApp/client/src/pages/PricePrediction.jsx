import React, { useState, useEffect } from "react";
import Select from "react-select";
import lahore_locations from "../components/locations/lahore_locations";
import karachi_locations from "../components/locations/karachi_locations";
import islamabad_locations from "../components/locations/islamabad_locations";

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

  const locationMap = {
    Islamabad: islamabad_locations,
    Lahore: lahore_locations,
    Karachi: karachi_locations,
  };

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
      setPrice((data.predicted_price * 371.31) / 183.54);
    } catch (error) {
      console.error(error);
      setPrice(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle city change separately
    if (name === "city") {
      setFormDetails((prev) => ({ ...prev, [name]: value, location: "" })); // Reset location
    } else {
      setFormDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedLocation(selectedOption); // Set selected location
    setFormDetails((prev) => ({
      ...prev,
      location: selectedOption ? selectedOption.value : "",
    })); // Set location as string
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
            onChange={handleInputChange}
            value={formDetails.property_type}
          >
            <option value="House">House</option>
            <option value="Flat">Flat</option>
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
            onChange={handleInputChange}
            value={formDetails.city}
          >
            <option value="Islamabad">Islamabad</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
          </select>
        </div>
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
        <div className="flex flex-col gap-2">
          <label htmlFor="baths" className="text-lg font-medium text-gray-700">
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
      <div className="mt-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Predicted Price</h2>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {price > 0 ? `${price.toLocaleString()} Rs` : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default PricePrediction;
