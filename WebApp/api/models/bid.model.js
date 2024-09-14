import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    offer: {
      type: Number,
      required: true,
    },
    occupants: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    listingRef: {
      type: String,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidSchema);

export default Bid;
