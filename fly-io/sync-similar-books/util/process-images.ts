import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8";

const client = new LambdaClient({
  region: "us-east-1"
});

export type ProcessImagesResponse = {
  mediumImage: string;
  mediumImagePreview: any;
  smallImage: string;
  smallImagePreview: any;
  mobileImage: string;
  mobileImagePreview: any;
};

export async function processImages(url: string): Promise<ProcessImagesResponse | undefined> {
  const command = new InvokeCommand({
    FunctionName: "process-book-cover-live-processCover",
    Payload: fromUtf8(JSON.stringify({ url: url, userId: "similar-books" }))
  });
  const response = await client.send(command);

  if (response.Payload) {
    try {
      const respJson = JSON.parse(toUtf8(response.Payload)) as ProcessImagesResponse;
      return respJson;
    } catch (er) {
      console.log("Error syncing book cover", er);
    }
  } else {
    console.log("can't process");
  }
}
