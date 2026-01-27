import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {type: String, ref: "User",required: true,},
    hotel: {type: String, ref: "Hotel",required: true,},
    booking: {type: String, ref: "Booking",required: true,unique: true,},
    rating: {type: Number,min: 1,max: 5,required: true,},
    comment: {type: String, maxlength: 1000, },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
