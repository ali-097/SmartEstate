import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ContactLandlord({ listing, email, setContact }) {
  const { currentUser } = useSelector((state) => state.user);
  const [landlord, setLandlord] = useState(null);
  const [bid, setBid] = useState({
    name: "",
    email: email,
    phone: "",
    offer: "",
    occupants: "",
    message: "",
  });
  const [bidSent, setBidSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setBid({ ...bid, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        console.log(data);
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const submitBid = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (bid.occupants === "") {
      bid.occupants = -1;
    }
    if (bid.message === "") {
      bid.message = "Not specified";
    }
    try {
      const res = await fetch(`/api/bid/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bid,
          listingRef: listing._id,
          userRef: listing.userRef,
          accepted: false,
          bidderRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.log(bid);
      console.log(error);
    }
    setBidSent(true);
    setTimeout(() => {
      setBidSent(false);
      setContact(false);
    }, 3000);
  };

  return (
    <div>
      {landlord && (
        <div className="flex flex-col text-center gap-2">
          <h3 className="text-xl">Landlord details</h3>
          <p className="mb-2">
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span className="font-semibold capitalize">{listing.name}</span>
          </p>
          <form className="flex flex-col gap-2" onSubmit={submitBid}>
            <input
              type="text"
              id="name"
              name="name"
              onChange={onChange}
              placeholder="Name"
              className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              onChange={onChange}
              placeholder="Email"
              className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={email}
              required
            />
            <input
              type="number"
              id="phone"
              name="phone"
              onChange={onChange}
              placeholder="Phone"
              className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
            <input
              type="number"
              id="offer"
              name="offer"
              onChange={onChange}
              placeholder="Offer"
              className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              min="1"
              required
            />
            {listing.type === "rent" && (
              <input
                type="number"
                id="occupants"
                name="occupants"
                onChange={onChange}
                placeholder="Number of occupants (optional)"
                min="1"
                className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            )}
            <textarea
              type="text"
              id="message"
              name="message"
              onChange={onChange}
              placeholder="Enter your message here (optional)"
              className="block w-full rounded-md border-0 outline-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className={`flex justify-center items-center gap-2 rounded-md bg-myblue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  Send Message
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M3 20v-6l8-2l-8-2V4l19 8l-19 8Z"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
          {bidSent && (
            <p className="flex justify-center items-center text-green-600 mt-2">
              Bid sent successfully!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
