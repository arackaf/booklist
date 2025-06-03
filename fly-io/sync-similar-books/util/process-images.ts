import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8";

const client = new LambdaClient({
  region: "us-east-1"
});

export async function processImages(books: any[]) {
  for (const book of books) {
    const command = new InvokeCommand({
      FunctionName: "process-book-cover-live-processCover",
      Payload: fromUtf8(JSON.stringify({ url: book.img, userId: "similar-books" }))
    });
    const response = await client.send(command);

    if (response.Payload) {
      try {
        const respJson = JSON.parse(toUtf8(response.Payload));

        delete book.img;
        book.smallImage = respJson.smallImage;
        book.smallImagePreview = respJson.smallImagePreview;
        book.mobileImage = respJson.mobileImage;
        book.mobileImagePreview = respJson.mobileImagePreview;
      } catch (er) {
        console.log("Error syncing book cover");
      }
    } else {
      console.log("can't process");
    }
  }
}
