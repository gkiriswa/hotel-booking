import RatingStars from "./RatingStars";

export default function ReviewCard({ review }) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between">
        <p className="font-semibold">{review.user.name}</p>
        <small className="text-gray-400">
          {new Date(review.createdAt).toLocaleDateString()}
        </small>
      </div>

      <RatingStars value={review.rating} />

      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
}
