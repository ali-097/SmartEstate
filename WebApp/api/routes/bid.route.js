import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createBid,
  deleteBid,
  updateBid,
  getBid,
  // getBids,
  getAllBids,
  getListingBids,
  getBidCount,
  getSentBids,
} from "../controllers/bid.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createBid);
router.delete("/delete/:id", verifyToken, deleteBid);
router.post("/update/:id", verifyToken, updateBid);
router.get("/get/:id", getBid);
router.get("/sent/:id", getSentBids);
// router.get("/get", getBids);
router.get("/all", getAllBids);
router.get("/listing/:id", getListingBids);
router.get("/count/:id", getBidCount);

export default router;
