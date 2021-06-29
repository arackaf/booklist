export default {
  Query: {
    getUser() {
      return {
        User: {
          isPublic: true,
          publicBooksHeader: "Adam",
          publicName: "Adam Public"
        }
      };
    }
  },
  Mutation: {
    updateUser(args) {}
  }
};
