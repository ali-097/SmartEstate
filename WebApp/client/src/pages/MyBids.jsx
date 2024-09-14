import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Helmet from "../components/Helmet";
import Listing from "./Listing";

const MyBids = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showBidsError, setShowBidsError] = useState(false);
  const [userBids, setUserBids] = useState([]);
  const [listings, setListings] = useState({});

  const handleShowBids = async () => {
    try {
      setShowBidsError(false);
      const res = await fetch(`/api/user/bids/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowBidsError(true);
        return;
      }

      setUserBids(data);
      await fetchListings(data);
      console.log(data);
    } catch (error) {
      setShowBidsError(true);
    }
  };

  const fetchListings = async (bids) => {
    const fetchedListings = {};
    for (const bid of bids) {
      const listing = await getListing(bid.listingRef);
      fetchedListings[bid.listingRef] = listing;
    }
    setListings(fetchedListings); // Update state with full listing data
  };

  const handleBidDelete = async (bidId) => {
    try {
      const res = await fetch(`/api/bid/delete/${bidId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserBids((prev) => prev.filter((bid) => bid._id !== bidId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
      return { name: "Unknown Listing" }; // Fallback in case of error
    }
  };

  return (
    <Helmet title={"My Bids"}>
      <section className="pb-36">
        <div className="flex flex-1 flex-col justify-center px-6 py-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              My Bids
            </h2>
          </div>

          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="space-y-6">
              <button
                onClick={handleShowBids}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-green-700"
              >
                Click here to Show Bids
              </button>
              <p className="text-red-700 mt-5">
                {showBidsError &&
                  "Could not load bids. Please try again later."}
              </p>

              {userBids.length > 0 &&
                userBids.map((bid) => (
                  <div
                    key={bid._id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                  >
                    {/* Listing Information */}
                    <div className="px-4 py-5 sm:px-6 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {listings[bid.listingRef]?.name || "Loading..."}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        <p>{listings[bid.listingRef]?.type || "Loading..."}</p>
                        <p>
                          {listings[bid.listingRef]?.address || "Loading..."}
                        </p>
                      </div>
                    </div>

                    {/* Bid Information */}
                    <div className="px-4 py-5 sm:px-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Name
                          </p>
                          <p className="text-sm text-gray-500">{bid.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email
                          </p>
                          <p className="text-sm text-gray-500">{bid.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Phone
                          </p>
                          <p className="text-sm text-gray-500">{bid.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Offer Amount
                          </p>
                          <p className="text-sm text-gray-500">
                            {bid.offer} Rs
                          </p>
                        </div>
                        {bid.occupants != -1 && (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Occupants
                            </p>
                            <p className="text-sm text-gray-500">
                              {bid.occupants}
                            </p>
                          </div>
                        )}
                      </div>

                      {bid.message != "Not specified" && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-900">
                            Message
                          </p>
                          <p className="text-sm text-gray-500">{bid.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-4 sm:px-6 border-t flex justify-between">
                      <Link
                        to={`/listing/${bid.listingRef}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Listing
                      </Link>
                      <button
                        onClick={() => handleBidDelete(bid._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete Bid
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </Helmet>
  );
};

export default MyBids;
