import { useState } from "react";
import StarRatingInput from "./StarRatingInput";

export default function ReviewForm({ bookingId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    onSubmit({ bookingId, rating, comment });
  };

  return (
    <div className="border rounded-lg p-4 mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      <StarRatingInput rating={rating} setRating={setRating} />

      <textarea
        rows="4"
        className="w-full border rounded-md p-2"
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Submit Review
      </button>
    </div>
  );
}
