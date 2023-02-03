import { getPendingCount } from "../util/data-helpers";

export const handler = async event => {
  try {
    const { userId } = event;
    const pendingCount = await getPendingCount(userId);

    return { pendingCount };
  } catch (er) {
    console.log("ERROR", er);
    return { error: true };
  }
};
