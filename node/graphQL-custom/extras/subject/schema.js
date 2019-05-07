export default {
  Mutation: `
    updateSubject(_id: String, name: String, backgroundColor: String, textColor: String, parentId: String): [Subject]

    deleteSubject(_id: String): [String]
  `
};
