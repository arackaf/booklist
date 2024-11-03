export default {
  Mutation: `
    updateSubject(_id: String, name: String, backgroundColor: String, textColor: String, parentId: String): SubjectMutationResultMulti

    deleteSubject(_id: String): [String]
  `
};
