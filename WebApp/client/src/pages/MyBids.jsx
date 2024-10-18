import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Helmet from "../components/Helmet";
import BidModal from "../components/BidModal";
import emailjs from "@emailjs/browser";

const MyBids = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showBidsError, setShowBidsError] = useState("");
  const [userBids, setUserBids] = useState([]);
  const [sentBids, setSentBids] = useState([]);
  const [listings, setListings] = useState({});
  const [bidType, setBidType] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  useEffect(() => {
    handleShowBids();
    // handlegetBids();
  }, []);

  const handleEditClick = (bid) => {
    if (bid.accepted) {
      setShowBidsError("Cannot modify an accepted bid.");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        setShowBidsError("");
      }, 3000);
      return;
    }
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBid(null);
  };

  const handleShowBids = async () => {
    try {
      setShowBidsError(false);
      const res = await fetch(`/api/user/bids/${currentUser._id}`);
      const data = await res.json();

      if (data.length === 0) {
        setShowBidsError("No bids found.");
        return;
      }

      if (data.success === false) {
        setShowBidsError("Could not load bids. Please try again later.");
        return;
      }
      setUserBids(data);
      setBidType(1);
      await fetchListings(data);
      // console.log(data);
    } catch (error) {
      setShowBidsError("Could not load bids. Please try again later.");
    }
  };

  const handlegetBids = async () => {
    try {
      setShowBidsError(false);
      // console.log(currentUser._id);
      const res = await fetch(`/api/bid/sent/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowBidsError("Could not load bids. Please try again later.");
        return;
      }
      if (data.length === 0) {
        setShowBidsError("No bids found.");
        return;
      }
      setSentBids(data);
      setBidType(2);
      await fetchListings(data);
    } catch (error) {
      setShowBidsError("Could not load bids. Please try again later.");
    }
  };

  const fetchListings = async (bids) => {
    const fetchedListings = {};
    for (const bid of bids) {
      const listing = await getListing(bid.listingRef);
      fetchedListings[bid.listingRef] = listing;
    }
    setListings(fetchedListings);
  };

  const handleBidDelete = async (bidId, deletionType) => {
    if (
      sentBids.find((bid) => bid._id === bidId)?.accepted ||
      userBids.find((bid) => bid._id === bidId)?.accepted
    ) {
      setShowBidsError("Cannot delete an accepted bid.");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setShowBidsError("");
      }, 3000);
      return;
    }

    if (deletionType === "reject") {
      const bid = userBids.find((bid) => bid._id === bidId);

      const templateParams = {
        user_email: bid.email,
        user_name: bid.name,
        listing_name: listings[bid.listingRef]?.name || "Unknown Listing",
        offer_amount: bid.offer,
        rejection_message:
          "We're sorry to inform you that your bid has been rejected.",
      };

      try {
        emailjs.send(
          // 'YOUR_SERVICE_ID',
          import.meta.env.VITE_SERVICE_ID,
          // 'YOUR_TEMPLATE_ID',
          import.meta.env.VITE_ALT_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_PUBLIC_KEY
          // form.current, 'YOUR_PUBLIC_KEY'
        );
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }

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
      setSentBids((prev) => prev.filter((bid) => bid._id !== bidId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBidAccept = async (bidId) => {
    try {
      const res = await fetch(`/api/bid/update/${bidId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accepted: true }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserBids((prev) =>
        prev.map((bid) =>
          bid._id === bidId ? { ...bid, accepted: true } : bid
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleBidUpdate = async (updatedBid) => {
    if (updatedBid.occupants === "") updatedBid.occupants = -1;
    if (updatedBid.message === "") updatedBid.message = "Not specified";

    try {
      const res = await fetch(`/api/bid/update/${updatedBid._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBid),
      });
      const data = await res.json();
      setSentBids((prev) =>
        prev.map((bid) => (bid._id === updatedBid._id ? updatedBid : bid))
      );
      if (data.success) {
        // Update the userBids state to reflect the modified bid
        console.log("Bid updated successfully");
      } else {
        console.log(data.message);
      }
      // update the bid in the userBids state
    } catch (error) {
      console.log("Error updating bid:", error.message);
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
      return { name: "Unknown Listing" };
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
            <div className="flex justify-center gap-4">
              <button
                onClick={handleShowBids}
                className={`${
                  bidType === 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900"
                } px-4 py-2 rounded-md font-medium`}
              >
                Received Bids
              </button>
              <button
                onClick={handlegetBids}
                className={`${
                  bidType === 2
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900"
                } px-4 py-2 rounded-md font-medium`}
              >
                Sent Bids
              </button>
            </div>

            <div className="mt-6">
              {showBidsError && (
                <div className="text-red-600 text-center">{showBidsError}</div>
              )}

              {userBids.length > 0 &&
                bidType === 1 &&
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

                        {bid.accepted && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                            Accepted
                          </div>
                        )}
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
                      <div className="flex gap-4">
                        {!bid.accepted && (
                          <button
                            className="text-green-600 hover:text-green-800 font-medium"
                            onClick={() => handleBidAccept(bid._id)}
                          >
                            Accept Bid
                          </button>
                        )}

                        <button
                          onClick={() => handleBidDelete(bid._id, "reject")}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Reject Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              <BidModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bid={selectedBid}
                onSubmit={handleBidUpdate}
              />

              {sentBids.length > 0 &&
                bidType === 2 &&
                sentBids.map((bid) => (
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
                        {/* show whether bid is acppeted or not with differnet css styling*/}
                        <div
                          className={`${
                            bid.accepted
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          } px-2 py-1 rounded-md text-sm`}
                        >
                          {bid.accepted ? "Accepted" : "Not Accepted"}
                        </div>
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
                      {/* add button to modify bid */}
                      <div className="flex gap-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => handleEditClick(bid)}
                        >
                          Modify Bid
                        </button>
                        <button
                          onClick={() => handleBidDelete(bid._id, "delete")}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete Bid
                        </button>
                      </div>
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
