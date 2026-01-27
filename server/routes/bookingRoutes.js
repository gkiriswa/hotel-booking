import express from "express";
import { 
    checkAvailabilityAPI,
    createBooking,
    getUserBookings,
    getHotelBookings,
  } from "../controllers/bookingController.js";
import { Protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', Protect, createBooking);
bookingRouter.get('/user',  Protect, getUserBookings);
bookingRouter.get('/hotel', Protect, getHotelBookings);

export default bookingRouter;