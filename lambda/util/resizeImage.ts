import Jimp from "jimp";

export type ResizeImageFailure = { STATUS: "error"; message?: string; previewGenerationError?: boolean };
export type ResizeInvalidSize = { STATUS: "invalid-size" };
export type ResizeSuccess = { STATUS: "success"; image: Jimp; preview: string };

export type ResizeImageResult = ResizeImageFailure | ResizeSuccess | ResizeInvalidSize;

export function resizeImage(src, maxWidth, quality) {
  return new Promise<ResizeImageResult>(res => {
    Jimp.read(src, async function (err, image) {
      if (err || !image) {
        console.log("Error reading file", err);
        return res({ STATUS: "error" });
      }

      const minWidth = maxWidth - 5;

      if (image.bitmap.width < minWidth) {
        return res({ STATUS: "invalid-size" });
      }
      if (image.bitmap.width > maxWidth) {
        image.resize(maxWidth, Jimp.AUTO);
      }
      image.quality(quality);

      let preview;
      try {
        const previewImage = image.clone();
        previewImage.quality(25).blur(8);
        preview = await previewImage.getBase64Async(previewImage.getMIME());
      } catch (er) {
        console.log("Error generating preview", err);
        return res({ STATUS: "error", previewGenerationError: true });
      }

      res({ STATUS: "success", image, preview });
    });
  });
}

type GetBufferResult = ResizeImageFailure | ResizeInvalidSize | { STATUS: "success"; body: any; preview: string };
export async function getBuffer(result: ResizeImageResult): Promise<GetBufferResult> {
  if (result.STATUS !== "success") {
    return result;
  }
  const { image, preview } = result;

  return new Promise(res => {
    if (image && preview) {
      image.getBuffer(image.getMIME(), (err, body) => {
        if (err || !body) {
          console.log("Get buffer error", err);
          return res({ STATUS: "error" });
        }

        return res({ STATUS: "success", body, preview });
      });
    }
  });
}
