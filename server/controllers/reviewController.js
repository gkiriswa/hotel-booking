import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== userId)
      return res.status(403).json({ message: "Not your booking" });

    if (!booking.isCompleted)
      return res.status(400).json({ message: "Stay not completed" });

    if (booking.isReviewed)
      return res.status(400).json({ message: "Already reviewed" });

    const review = await Review.create({
      user: userId,
      hotel: booking.hotel,
      booking: bookingId,
      rating,
      comment,
    });

    booking.isReviewed = true;
    await booking.save();

    const stats = await Review.aggregate([
      { $match: { hotel: booking.hotel } },
      {
        $group: {
          _id: "$hotel",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Hotel.findByIdAndUpdate(booking.hotel, {
      averageRating: stats[0].avgRating,
      reviewCount: stats[0].count,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to create review" });
  }
};
