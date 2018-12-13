import BooksMiddleware from "./middleware/books";
import BooksDeletedMiddleware from "./middleware/booksDeleted";
import SubjectsMiddleware from "./middleware/subjects";
import SubjectsDeletedMiddleware from "./middleware/subjectsDeleted";
import TagsMiddleware from "./middleware/tags";
import TagsDeletedMiddleware from "./middleware/tagsDeleted";
import UsersMiddleware from "./middleware/users";
import PublicUsersMiddleware from "./middleware/publicUsers";

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
  BooksDeleted: BooksDeletedMiddleware,
  Subject: SubjectsMiddleware,
  SubjectsDeleted: SubjectsDeletedMiddleware,
  Tag: TagsMiddleware,
  TagsDeleted: TagsDeletedMiddleware,
  User: UsersMiddleware,
  PublicUser: PublicUsersMiddleware
};
