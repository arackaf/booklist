export const sharpDownload = async (url: string) => {
  try {
    const result = await fetch(url);
    const arrayBuffer = await result.arrayBuffer();
    return { body: Buffer.from(arrayBuffer) };
  } catch (err) {
    console.log("Error fetching image", err);
    return { error: true, msg: err };
  }
};
