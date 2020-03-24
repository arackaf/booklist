export default `query findBooks($ids: [String], $publicUserId: String) {
  allBooks(_id_in: $ids, publicUserId: $publicUserId) {
    Books {
      _id
      title
      similarItems
    }
  }
}`;
