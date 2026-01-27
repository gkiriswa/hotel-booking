import express from "express";
import {
  createReview,
  getHotelReviews,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/hotel/:hotelId", getHotelReviews);

export default router;
