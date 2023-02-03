import { getPendingCount } from "../util/data-helpers";

export const handler = async event => {
  try {
    const { userId } = event;
    console.log("CHECKING", userId);
    const pendingCount = await getPendingCount(userId);

    console.log("SENDING", { pendingCount });
    return { pendingCount };
  } catch (er) {
    console.log("ERROR", er);
    return { error: true };
  }
};
