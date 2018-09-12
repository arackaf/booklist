export default `query findRecommendations($asins: [String]) {
  allBookSummarys(asin_in: $asins) {
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
