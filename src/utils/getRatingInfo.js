export const getRatingInfo = (rating) => {
  if (rating >= 80) return { class: "rating-excellent", phrase: "Excellent" };
  if (rating >= 60) return { class: "rating-good", phrase: "Good" };
  if (rating >= 40) return { class: "rating-fair", phrase: "Fair" };
  if (rating >= 27) return { class: "rating-poor", phrase: "Poor" };
  return { class: "rating-very-poor", phrase: "Very Poor" };
};
