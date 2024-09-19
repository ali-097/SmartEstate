import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createReview,
  deleteReview,
  updateReview,
  getReview,
  getReviews,
  getReviewsByUser,
  getReviewsBySentiment,
  getReviewsByLocationAndSentiment,
  getReviewsByLocation,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createReview);
router.delete("/delete/:id", verifyToken, deleteReview);
router.put("/update/:id", verifyToken, updateReview);
router.get("/get/:id", getReview);
router.get("/get", getReviews);
router.get("/get/user/:userRef", getReviewsByUser);
router.get("/get/sentiment/:sentiment", getReviewsBySentiment);
router.get("/get/location/:location", getReviewsByLocation);
router.get(
  "/get/location/:location/sentiment/:sentiment",
  getReviewsByLocationAndSentiment
);

export default router;
