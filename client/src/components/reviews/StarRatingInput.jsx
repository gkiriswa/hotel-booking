export default function StarRatingInput({ rating, setRating }) {
  return (
    <div className="flex gap-1 text-yellow-400 text-2xl">
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setRating(n)}
        >
          {n <= rating ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
