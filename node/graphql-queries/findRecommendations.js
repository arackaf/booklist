export default `query findRecommendations($isbns: [String]) {
  allBookSummarys(isbn_in: $isbns) {
    BookSummarys {
      _id
      asin
      isbn
      ean
      title
      authors
      smallImage
    }
  }
}`;
