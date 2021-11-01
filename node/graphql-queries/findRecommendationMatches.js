export default `query findRecommendationMatches($isbns: [String], $eans: [String], $publicUserId: String) {
  allBooks(publicUserId: $publicUserId, OR: [ { isbn_in: $isbns }, { ean_in: $eans } ]) {
    Books {
      title
      isbn
      ean
    }
  }
}`;
