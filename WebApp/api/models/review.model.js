import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userRef: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
