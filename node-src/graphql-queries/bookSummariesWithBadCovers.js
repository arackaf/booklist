export default `query findBookSummariesWithBadCovers {
  allBookSummarys(smallImage_contains: "nophoto") {
    BookSummarys {
      _id
      isbn
      title
    }
  }
}`;
