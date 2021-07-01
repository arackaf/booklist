import UserDao from "../../dataAccess/user";

const userDao = new UserDao();
export default {
  Query: {
    async getUser(root, args, context, ast) {
      const user = await userDao.getUser(context.cookies["email"], context.user.id);
      return { User: user };
    },
    async getPublicUser(root, args, context, ast) {
      console.log({ userId: args.userId });
      const user = await userDao.getPublicUser(args.userId);
      return { PublicUser: user };
    }
  },
  Mutation: {
    updateUser(root, args, context, ast) {}
  }
};
