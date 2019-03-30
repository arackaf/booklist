export default `query findBookSummariesWithBadCovers($pageSize: Int) {
  allBookSummarys(smallImage_contains: "nophoto", PAGE: 1, PAGE_SIZE: $pageSize) {
    BookSummarys {
      _id
      isbn
      title
    }
  }
}`;
