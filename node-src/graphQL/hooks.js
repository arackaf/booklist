import BooksMiddleware from "../graphQL-custom/middleware/books";
import SubjectsMiddleware from "../graphQL-custom/middleware/subjects";
import TagsMiddleware from "../graphQL-custom/middleware/tags";
import UsersMiddleware from "../graphQL-custom/middleware/users";
import PublicUsersMiddleware from "../graphQL-custom/middleware/publicUsers";

export default {
  Root: {
    queryPreprocess(root, args, context, ast) {},
    queryMiddleware(queryPacket, root, args, context, ast) {},
    beforeInsert(objToBeInserted, root, args, context, ast) {},
    afterInsert(newObj, root, args, context, ast) {},
    beforeUpdate(match, updates, root, args, context, ast) {},
    afterUpdate(match, updates, root, args, context, ast) {},
    beforeDelete(match, root, args, context, ast) {},
    afterDelete(match, root, args, context, ast) {},
    adjustResults(results) {}
  },
  Book: BooksMiddleware,
  Subject: SubjectsMiddleware,
  Tag: TagsMiddleware,
  User: UsersMiddleware,
  PublicUser: PublicUsersMiddleware
};
