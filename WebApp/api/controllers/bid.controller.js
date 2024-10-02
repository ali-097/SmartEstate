import Bid from "../models/bid.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import { sendBidEmail } from "../utils/mailer.js";

// send email to user when bid is created
export const createBid = async (req, res, next) => {
  try {
    const bid = await Bid.create(req.body);
    const user = await User.findById(bid.userRef);
    if (user) {
      await sendBidEmail(user.email, bid);
    }
    return res.status(201).json(bid);
  } catch (error) {
    next(error);
  }
};

export const deleteBid = async (req, res, next) => {
  const bid = await Bid.findById(req.params.id);

  if (!bid) {
    return next(errorHandler(404, "Bid not found!"));
  }

  if (req.user.id !== bid.userRef) {
    return next(errorHandler(401, "You can only delete your own bids"));
  }

  try {
    await Bid.findByIdAndDelete(req.params.id);
    res.status(200).json("Bid has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateBid = async (req, res, next) => {
  const bid = await Bid.findById(req.params.id);
  if (!bid) {
    return next(errorHandler(404, "Bid not found!"));
  }
  if (req.user.id !== bid.bidderRef) {
    return next(errorHandler(401, "You can only update your own bids!"));
  }
  try {
    const updatedBid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBid);
  } catch (error) {
    next(error);
  }
};

export const getBid = async (req, res, next) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) {
      return next(errorHandler(404, "Bid not found!"));
    }
    res.status(200).json(bid);
  } catch (error) {
    next(error);
  }
};

export const getSentBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ bidderRef: req.params.id });
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

// export const getBids = async (req, res, next) => {
//   try {
//     const bids = await Bid.find({ userRef: req.user.id });
//     res.status(200).json(bids);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllBids = async (req, res, next) => {
  try {
    const bids = await Bid.find();
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

export const getListingBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ listingRef: req.params.id });
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

export const getBidCount = async (req, res, next) => {
  try {
    const count = await Bid.countDocuments({ listingRef: req.params.id });
    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};
