import mongoose from "mongoose";

// use createreview as a reference to create a review
const reviewSchema = new mongoose.Schema(
  {
    userRef: {
      type: String,
      required: true,
    },
    sentiment: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    safety: {
      type: Number,
      required: true,
    },
    cleanliness: {
      type: Number,
      required: true,
    },
    crime: {
      type: Number,
      required: true,
    },
    noise: {
      type: Number,
      required: true,
    },
    traffic: {
      type: Number,
      required: true,
    },
    water: {
      type: Number,
      required: true,
    },
    electricity: {
      type: Number,
      required: true,
    },
    gas: {
      type: Number,
      required: true,
    },
    reception: {
      type: Number,
      required: true,
    },
    transport: {
      type: Number,
      required: true,
    },
    hospital: {
      type: Boolean,
      required: true,
    },
    police: {
      type: Boolean,
      required: true,
    },
    fire: {
      type: Boolean,
      required: true,
    },
    park: {
      type: Boolean,
      required: true,
    },
    school: {
      type: Boolean,
      required: true,
    },
    market: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
