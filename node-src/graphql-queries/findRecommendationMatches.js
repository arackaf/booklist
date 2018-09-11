export default `query findRecommendationMatches($userId: String, $isbns: [String], $eans: [String]) {
  allBooks(userId: $userId, OR: [ { isbn_in: $isbns }, { ean_in: $eans } ]) {
    Books {
      isbn
      ean
    }
  }
}`;
