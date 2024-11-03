import UserDao2 from "../dataAccess/user";

(async function () {
  let u = new UserDao2();
  let res = await u.createUser("a@aol.com", "foobar", true);
  console.log("create", res);

  console.log("\n-------\n");

  console.log("activate 1", await u.activateUser(res.userId));
  console.log("activate 2", await u.activateUser(res.userId));

  console.log("\n-------\n");

  let user = await u.lookupUser("a@aoL.com", "foobar");
  console.log("Result == user", user);
  let resNull = await u.lookupUser("a@aoL.com", "foobar2");
  console.log("Result == null", resNull);

  console.log("\n-------\n");

  let userByLoginToken = await u.lookupUserByToken(`${user.id}|${user.loginToken}`);
  console.log("By loginToken", userByLoginToken);

  let userByLoginTokenNull = await u.lookupUserByToken(`xxx${user.id}|${user.loginToken}a`);
  console.log("By loginToken null", userByLoginTokenNull);

  userByLoginTokenNull = await u.lookupUserByToken(`${user.id}a|${user.loginToken}`);
  console.log("By loginToken null", userByLoginTokenNull);

  console.log("\n-------\n");
})();
