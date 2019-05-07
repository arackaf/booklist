export default `query findBooks($ids: [String]) {
  allBooks(_id_in: $ids) {
    Books {
      _id
      title
      similarItems
    }
  }
}`;
