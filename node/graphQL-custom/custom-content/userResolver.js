import UserDao from "../../dataAccess/user";

const userDao = new UserDao();
export default {
  Query: {
    async getUser(root, args, context, ast) {
      const user = await userDao.getUser(context.cookies["email"], context.user.id);
      return { User: user };
    },
    async getPublicUser(root, args, context, ast) {
      const user = await userDao.getPublicUser(args.userId);
      return { PublicUser: user };
    }
  },
  Mutation: {
    async updateUser(root, args, context, ast) {
      let updatedUser = await userDao.updateUser(context.cookies["email"], context.user.id, args.Updates);
      return { User: updatedUser.Attributes };
    }
  }
};
