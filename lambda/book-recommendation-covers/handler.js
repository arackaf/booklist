import updateBookSummaryCovers from "./updateBookSummaryCovers";

export const bookRecommendationBadCoverSync = async event => {
  await updateBookSummaryCovers();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Done!" })
  };
};
