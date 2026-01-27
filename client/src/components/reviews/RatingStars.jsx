export default function RatingStars({ value }) {
  return (
    <div className="flex gap-1 text-yellow-400">
      {[1,2,3,4,5].map((n) => (
        <span key={n}>
          {n <= value ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
