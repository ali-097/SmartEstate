import { useEffect, useState } from "react";
import Helmet from "../components/Helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateReview = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [review, setReview] = useState({
    userRef: currentUser._id,
    location: "",
    sentiment: "",
    review: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value,
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

    try {
      const response = await fetch("http://localhost:5000/predict-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review: review.review }),
      });

      const sentimentData = await response.json();
      if (response.ok) {
        // Update sentiment in the review state
        const updatedReview = {
          ...review,
          sentiment: sentimentData.sentiment,
        };

        // Call postReview with the updated review
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
  };

  return (
    <>
      <Helmet title="Create Review" />
      <div className="container mx-auto max-w-md py-10">
        <h1 className="text-center text-3xl font-bold mb-5">Create Review</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-lg rounded-lg p-8"
        >
          <div className="form-group">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              id="location"
              name="location"
              value={review.location}
              onChange={handleChange}
              placeholder="Enter the location"
              required
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700"
            >
              Review
            </label>
            <textarea
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              id="review"
              name="review"
              rows="5"
              value={review.review}
              onChange={handleChange}
              placeholder="Write your review here"
              required
            />
          </div>

          {loading && (
            <p className="text-blue-500 text-center">Analyzing sentiment...</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700"
            disabled={loading}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateReview;
