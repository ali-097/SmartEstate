import { useState } from "react";
import Helmet from "../components/Helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateReview = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [review, setReview] = useState({
    userRef: currentUser._id,
    sentiment: "",
    city: "",
    area: "",
    safety: 0,
    cleanliness: 0,
    crime: 0,
    noise: 0,
    traffic: 0,
    water: 0,
    electricity: 0,
    gas: 0,
    reception: 0,
    transport: 0,
    hospital: false,
    police: false,
    fire: false,
    park: false,
    school: false,
    market: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cities = ["Islamabad", "Lahore", "Karachi"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setReview({
      ...review,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const postReview = async (updatedReview) => {
    try {
      const response = await fetch("/api/review/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReview),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (review.message) {
      try {
        const response = await fetch("/modelsapi/predict-sentiment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ review: review.message }),
        });

        const sentimentData = await response.json();
        if (response.ok) {
          const updatedReview = {
            ...review,
            sentiment: sentimentData.sentiment,
          };

          await postReview(updatedReview);
        } else {
          setError(sentimentData.message || "Failed to analyze sentiment.");
        }
      } catch (error) {
        setError("An error occurred while processing your request.");
      } finally {
        setLoading(false);
      }
      navigate("/community-reviews");
    } else {
      postReview(review);
      navigate("/community-reviews");
    }
  };

  const getSmiley = (value) => {
    switch (value) {
      case 0:
        return "😢";
      case 1:
        return "😟";
      case 2:
        return "😐";
      case 3:
        return "🙂";
      case 4:
        return "😁";
      default:
        return "";
    }
  };

  return (
    <>
      <Helmet title="Create Review" />
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
          Create Review
        </h1>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-lg rounded-lg p-8"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="city" className="font-semibold text-gray-700">
                City
              </label>
              <select
                name="city"
                id="city"
                value={review.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="" disabled>
                  Select City
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="area" className="font-semibold text-gray-700">
                Area
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={review.area}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="Enter Area"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="font-semibold mb-2 text-lg text-gray-800">
                Environment
              </h2>
              {["safety", "cleanliness", "crime", "noise", "traffic"].map(
                (field) => (
                  <div key={field} className="mb-6">
                    <label className="block font-medium mb-2 text-gray-600">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">
                        {getSmiley(review[field])}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={review[field]}
                        onChange={(e) =>
                          setReview({
                            ...review,
                            [field]: Number(e.target.value),
                          })
                        }
                        required
                        className="w-full mx-2 slider"
                        style={{
                          appearance: "none",
                          height: "6px",
                          background: "#e0e0e0",
                          borderRadius: "5px",
                          outline: "none",
                          opacity: "0.7",
                          transition: "opacity .2s",
                        }}
                      />
                      <span className="text-2xl">
                        {getSmiley(review[field])}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="font-semibold mb-2 text-lg text-gray-800">
                Utilities
              </h2>
              {["water", "electricity", "gas", "reception", "transport"].map(
                (utility) => (
                  <div key={utility} className="mb-6">
                    <label className="block font-medium mb-2 text-gray-600">
                      {utility.charAt(0).toUpperCase() + utility.slice(1)}
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">
                        {getSmiley(review[utility])}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={review[utility]}
                        onChange={(e) =>
                          setReview({
                            ...review,
                            [utility]: Number(e.target.value),
                          })
                        }
                        required
                        className="w-full mx-2 slider"
                        style={{
                          appearance: "none",
                          height: "6px",
                          background: "#e0e0e0",
                          borderRadius: "5px",
                          outline: "none",
                          opacity: "0.7",
                          transition: "opacity .2s",
                        }}
                      />
                      <span className="text-2xl">
                        {getSmiley(review[utility])}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="font-semibold mb-2 text-lg text-gray-800">
                Amenities
              </h2>
              {["hospital", "police", "fire", "park", "school", "market"].map(
                (amenity) => (
                  <div key={amenity} className="flex items-center mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name={amenity}
                        checked={review[amenity]}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-gray-600">
                        {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                      </span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block font-semibold text-gray-700 mb-2"
            >
              Additional Comments
            </label>
            <textarea
              id="message"
              name="message"
              value={review.message}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your thoughts..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateReview;
