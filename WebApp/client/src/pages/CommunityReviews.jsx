import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Helmet from "../components/Helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CommunityReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchSentiment, setSearchSentiment] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/review/get");
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setReviews(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Filter reviews based on search criteria
  const filteredReviews = reviews.filter((review) => {
    const matchesLocation = searchLocation
      ? review.location.toLowerCase().includes(searchLocation.toLowerCase())
      : true;
    const matchesSentiment = searchSentiment
      ? review.sentiment.toString() === searchSentiment // Convert sentiment to string
      : true;
    return matchesLocation && matchesSentiment;
  });

  return (
    <Helmet title={"Community Reviews"}>
      <section className="reviews">
        {loading && (
          <div className="py-36 flex items-center justify-center text-center">
            <p className="text-2xl">loading...</p>
          </div>
        )}
        {error && (
          <div className="py-36 flex flex-col items-center justify-center text-center">
            <div
              className="flex items-center text-2xl text-red-800"
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 mr-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">Something went wrong!</span>
              </div>
            </div>
            <Link to={"/"} className="mt-4 underline">
              Return home
            </Link>
          </div>
        )}

        {reviews && !loading && !error && (
          <div className="py-10 max-w-7xl mx-auto px-4 lg:px-8 xl:max-w-full">
            <h3 className="text-2xl font-semibold mb-5 text-center text-gray-800">
              Community Reviews
            </h3>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => navigate("/create-review")}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Create Review
              </button>
            </div>

            <div className="flex flex-col items-center md:flex-row md:justify-center mb-8 gap-4">
              <input
                type="text"
                placeholder="Search by location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full md:w-1/3"
              />
              <select
                className="border border-gray-300 p-2 rounded-md w-full md:w-1/3"
                name="sentiment"
                value={searchSentiment}
                onChange={(e) => setSearchSentiment(e.target.value)}
              >
                <option value="">All Sentiments</option>
                <option value="1">Positive</option>
                <option value="0">Negative</option>
              </select>
            </div>

            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white shadow-lg rounded-lg p-6 transition-transform hover:scale-105"
                  >
                    <h4 className="text-lg font-semibold mb-2 text-gray-700">
                      {review.location}
                    </h4>
                    <p className="text-gray-600 mb-3">{review.review}</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        review.sentiment == 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.sentiment == 1 ? "Positive" : "Negative"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-lg font-medium text-gray-600">
                  No reviews match your search criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </Helmet>
  );
};

export default CommunityReviews;
