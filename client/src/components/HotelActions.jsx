export default function HotelActions({
  rating,
  reviewCount,
  onReserve,
  onReview,
}) {
  return (
    <div className="flex items-center gap-4">
      {/* Rating / Reviews */}
      <div className="flex items-center gap-1 text-gray-600">
        <span>⭐</span>
        <span className="text-sm">
            {reviewCount > 0
            ? `${(rating ?? 0).toFixed(1)} (${reviewCount})`
            : "No reviews yet"}
        </span>
      </div>

      {/* Reserve Now */}
      <button
        onClick={onReserve}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
      >
        Reserve Now
      </button>

      {/* Write Review */}
      <button
        onClick={onReview}
        className="border px-4 py-2 rounded-md hover:bg-gray-100"
      >
        Write a Review
      </button>
    </div>
  );
}
