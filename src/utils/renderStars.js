export const renderStars = (rating) => {
  const totalStars = 5;
  let filledStars = 0;

  if (rating >= 80) filledStars = 5;
  else if (rating >= 60) filledStars = 4;
  else if (rating >= 40) filledStars = 3;
  else if (rating >= 27) filledStars = 2;
  else filledStars = 1;

  return (
    <div className="seller-rating">
      {Array.from({ length: totalStars }).map((_, index) => (
        <span
          key={index}
          className={`star ${index < filledStars ? "filled" : ""}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};
