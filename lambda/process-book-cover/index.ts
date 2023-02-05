import { processCover } from "./util/processCover";

export const handler = async (event: any) => {
  const { url, userId } = event;
  console.log("Processing", { url, userId });

  const result = await processCover(url, userId);

  return result;
};
