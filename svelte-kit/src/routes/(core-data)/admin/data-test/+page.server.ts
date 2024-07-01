import { getJunkValue } from "../../../../../../data/junk";

export const load = async ({ parent }) => {
  const junk = getJunkValue();

  return { junk };
};
