import ReviewCard from "./ReviewCard";

export default function ReviewsSection({ reviews }) {
  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-xl font-bold">Guest Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet</p>
      )}

      {reviews.map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </section>
  );
}
