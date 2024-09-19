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
                <div>
                  <p className="text-lg font-semibold">
                    Location:{" "}
                    <span className="font-normal">{review.location}</span>
                  </p>
                  <p className="text-gray-700">
                    Review: <span className="italic">{review.review}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {/* show green text and positive for 1 and red and negative for 0 */}
                    Sentiment:{" "}
                    <span
                      className={`${
                        review.sentiment === "1"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-bold`}
                    >
                      {review.sentiment === "1" ? "Positive" : "Negative"}
                    </span>
                  </p>
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
