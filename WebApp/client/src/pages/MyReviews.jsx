import { useState } from "react";
import { useSelector } from "react-redux";
import Helmet from "../components/Helmet";

const MyReviews = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showReviewsError, setShowReviewsError] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  const handleShowReviews = async () => {
    try {
      setShowReviewsError(false);
      const res = await fetch(`/api/user/reviews/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowReviewsError(true);
        return;
      }

      setUserReviews(data);
      console.log(data);
    } catch (error) {
      setShowReviewsError(true);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      const res = await fetch(`/api/review/delete/${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserReviews((prev) =>
        prev.filter((review) => review._id !== reviewId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Helmet title="My Reviews" />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">My Reviews</h1>

        <div className="text-center mb-4">
          <button
            onClick={handleShowReviews}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            Show My Reviews
          </button>
        </div>

        {showReviewsError && (
          <p className="text-red-500 text-center">Failed to fetch reviews.</p>
        )}

        {userReviews.length > 0 ? (
          <ul className="space-y-4">
            {userReviews.map((review) => (
              <li
                key={review._id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex justify-between items-center"
              >
                {/* display review city, area in one row */}
                {/* then display enivonrment heading and scores for ["safety", "cleanliness", "crime", "noise", "traffic"] out of 4 */}
                {/* then display utilites heading and scores for ["water", "electricity", "gas", "reception", "transport"] out of 4 */}
                {/* then display amenties heading with all available amentiies */}
                {/* finally display the review message and sentiment if they exist */}
                <div className="flex-1 p-4">
                  <h2 className="font-semibold text-lg text-gray-800">{`${review.city}, ${review.area}`}</h2>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-300 pt-2">
                    <div>
                      <h3 className="font-medium text-gray-700">Environment</h3>
                      <div className="text-gray-600 text-sm">
                        <p>
                          Safety:{" "}
                          <span className="font-semibold">
                            {review.safety}/4
                          </span>
                        </p>
                        <p>
                          Cleanliness:{" "}
                          <span className="font-semibold">
                            {review.cleanliness}/4
                          </span>
                        </p>
                        <p>
                          Crime:{" "}
                          <span className="font-semibold">
                            {review.crime}/4
                          </span>
                        </p>
                        <p>
                          Noise:{" "}
                          <span className="font-semibold">
                            {review.noise}/4
                          </span>
                        </p>
                        <p>
                          Traffic:{" "}
                          <span className="font-semibold">
                            {review.traffic}/4
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Utilities</h3>
                      <div className="text-gray-600 text-sm">
                        <p>
                          Water:{" "}
                          <span className="font-semibold">
                            {review.water}/4
                          </span>
                        </p>
                        <p>
                          Electricity:{" "}
                          <span className="font-semibold">
                            {review.electricity}/4
                          </span>
                        </p>
                        <p>
                          Gas:{" "}
                          <span className="font-semibold">{review.gas}/4</span>
                        </p>
                        <p>
                          Reception:{" "}
                          <span className="font-semibold">
                            {review.reception}/4
                          </span>
                        </p>
                        <p>
                          Transport:{" "}
                          <span className="font-semibold">
                            {review.transport}/4
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2">
                      <h3 className="font-medium text-gray-700">Amenities</h3>
                      <div className="text-gray-600 text-sm grid grid-cols-2 gap-2">
                        <p>
                          Hospital:{" "}
                          <span
                            className={
                              review.hospital
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {review.hospital ? "Available" : "Not Available"}
                          </span>
                        </p>
                        <p>
                          Police:{" "}
                          <span
                            className={
                              review.police ? "text-green-600" : "text-red-600"
                            }
                          >
                            {review.police ? "Available" : "Not Available"}
                          </span>
                        </p>
                        <p>
                          Fire:{" "}
                          <span
                            className={
                              review.fire ? "text-green-600" : "text-red-600"
                            }
                          >
                            {review.fire ? "Available" : "Not Available"}
                          </span>
                        </p>
                        <p>
                          Park:{" "}
                          <span
                            className={
                              review.park ? "text-green-600" : "text-red-600"
                            }
                          >
                            {review.park ? "Available" : "Not Available"}
                          </span>
                        </p>
                        <p>
                          School:{" "}
                          <span
                            className={
                              review.school ? "text-green-600" : "text-red-600"
                            }
                          >
                            {review.school ? "Available" : "Not Available"}
                          </span>
                        </p>
                        <p>
                          Market:{" "}
                          <span
                            className={
                              review.market ? "text-green-600" : "text-red-600"
                            }
                          >
                            {review.market ? "Available" : "Not Available"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {review.message && review.message.trim() && (
                    <div className="mt-2 border-t border-gray-300 pt-2">
                      <h3 className="font-medium text-gray-700">
                        Review Message
                      </h3>
                      <p className="text-gray-600 italic text-sm">
                        {review.message}
                      </p>
                      {review.sentiment && (
                        <p className="text-gray-600 text-sm">
                          Sentiment:{" "}
                          <span
                            className={
                              review.sentiment == 1
                                ? "text-green-600"
                                : review.sentiment === "Negative"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }
                          >
                            {review.sentiment == 1 ? "Positive" : "Negative"}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition ml-4"
                  onClick={() => handleReviewDelete(review._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No reviews available.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
