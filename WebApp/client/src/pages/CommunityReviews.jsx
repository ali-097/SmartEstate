import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Helmet from "../components/Helmet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";

const CommunityReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchArea, setSearchArea] = useState("");
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

  const filteredReviews = reviews.filter((review) => {
    const matchesLocation = searchLocation
      ? review.city.toLowerCase().includes(searchLocation.toLowerCase())
      : true;

    const matchesArea = searchArea
      ? review.area.toLowerCase().includes(searchArea.toLowerCase())
      : true;

    const matchesSentiment = searchSentiment
      ? review.sentiment?.toString() === searchSentiment
      : true;

    return matchesLocation && matchesArea && matchesSentiment;
  });

  const getColor = (value) => {
    switch (value) {
      case 0:
        return "#F56565"; // Red
      case 1:
        return "#F6AD55"; // Orange
      case 2:
        return "#ECC94B"; // Yellow
      case 3:
        return "#68D391"; // Green
      case 4:
        return "#48BB78"; // Dark Green
      default:
        return "#E2E8F0"; // Light Gray
    }
  };

  const renderRatingBar = (value, attribute) => {
    const percentage = value ? value * 25 : 1;
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">{attribute}</span>
          <span className="text-gray-600">{value}/4</span>
        </div>
        <ProgressBar
          completed={percentage}
          bgColor={getColor(value)}
          baseBgColor="#E2E8F0"
          height="5px"
          isLabelVisible={false}
          labelAlignment="outside"
          className="mt-2"
        />
      </div>
    );
  };

  return (
    <Helmet title={"Community Reviews"}>
      <section className="reviews">
        {loading && (
          <div className="py-36 flex items-center justify-center text-center">
            <p className="text-2xl text-gray-600">Loading...</p>
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
                <span className="font-medium text-gray-700">
                  Something went wrong!
                </span>
              </div>
            </div>
            <Link
              to={"/"}
              className="mt-4 underline text-indigo-600 hover:text-indigo-800"
            >
              Return home
            </Link>
          </div>
        )}

        {reviews && !loading && !error && (
          <div className="py-10 max-w-7xl mx-auto px-4 lg:px-8 xl:max-w-full">
            <h3 className="text-3xl font-bold mb-5 text-center text-gray-800">
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

            <div className="flex flex-col md:flex-row justify-center mb-8 gap-4">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search by location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search by area"
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="relative w-full md:w-1/3">
                <select
                  className="border border-gray-300 p-2 rounded-md w-full bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-300"
                  name="sentiment"
                  value={searchSentiment}
                  onChange={(e) => setSearchSentiment(e.target.value)}
                >
                  <option value="">All Sentiments</option>
                  <option value="1">Positive</option>
                  <option value="0">Negative</option>
                </select>
              </div>
            </div>

            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white shadow-md rounded-lg p-4 transition transform hover:scale-105 border border-gray-200"
                  >
                    <h4 className="font-bold text-2xl text-gray-800">
                      {review.city}
                    </h4>
                    <h5 className="font-semibold text-xl text-gray-600">
                      {review.area}
                    </h5>

                    <div className="flex justify-between mt-4">
                      <div className="w-1/2 pr-2">
                        <h5 className="font-semibold text-lg text-gray-700 border-b-2 border-gray-300 pb-2 mb-2">
                          Environment
                        </h5>
                        {renderRatingBar(review.safety || 0, "Safety")}
                        {renderRatingBar(
                          review.cleanliness || 0,
                          "Cleanliness"
                        )}
                        {renderRatingBar(review.crime || 0, "Crime")}
                        {renderRatingBar(review.noise || 0, "Noise")}
                        {renderRatingBar(review.traffic || 0, "Traffic")}
                      </div>

                      <div className="w-1/2 pl-2">
                        <h5 className="font-semibold text-lg text-gray-700 border-b-2 border-gray-300 pb-2 mb-2">
                          Utilities
                        </h5>
                        {renderRatingBar(review.water || 0, "Water")}
                        {renderRatingBar(
                          review.electricity || 0,
                          "Electricity"
                        )}
                        {renderRatingBar(review.gas || 0, "Gas")}
                        {renderRatingBar(review.reception || 0, "Reception")}
                        {renderRatingBar(review.transport || 0, "Transport")}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-semibold text-lg text-gray-700 border-b-2 border-gray-300 pb-2">
                        Amenities
                      </h5>
                      <div className="flex flex-wrap mt-2">
                        {review.hospital && (
                          <span title="Hospital" className="mr-2 text-gray-600">
                            🏥
                          </span>
                        )}
                        {review.police && (
                          <span title="Police" className="mr-2 text-gray-600">
                            👮
                          </span>
                        )}
                        {review.fire && (
                          <span
                            title="Fire Station"
                            className="mr-2 text-gray-600"
                          >
                            🚒
                          </span>
                        )}
                        {review.park && (
                          <span title="Park" className="mr-2 text-gray-600">
                            🌳
                          </span>
                        )}
                        {review.school && (
                          <span title="School" className="mr-2 text-gray-600">
                            🏫
                          </span>
                        )}
                        {review.market && (
                          <span title="Market" className="mr-2 text-gray-600">
                            🛒
                          </span>
                        )}
                      </div>
                      {!review.hospital &&
                        !review.police &&
                        !review.fire &&
                        !review.park &&
                        !review.school &&
                        !review.market && (
                          <p className="mt-2 text-gray-500 italic">
                            No amenities available
                          </p>
                        )}
                    </div>
                    <div className="relative mt-3">
                      {review.message && (
                        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                          <p className="text-gray-700 font-semibold italic">
                            User Review:
                          </p>
                          <p className="text-gray-600 italic">
                            {review.message}
                          </p>
                        </div>
                      )}
                      {review.message && (
                        <div className="absolute bottom-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-white font-semibold ${
                              review.sentiment == 1
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {review.sentiment == 1 ? "Positive" : "Negative"}
                          </span>
                        </div>
                      )}
                    </div>
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
