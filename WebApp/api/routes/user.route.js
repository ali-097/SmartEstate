import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
  getUserBids,
  getUserReviews,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);
router.get("/bids/:id", verifyToken, getUserBids);
router.get("/reviews/:id", verifyToken, getUserReviews);

export default router;
