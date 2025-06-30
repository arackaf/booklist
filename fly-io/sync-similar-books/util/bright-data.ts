import { wait } from "./sync-utils";

const { BRIGHT_DATA_API_KEY } = process.env;

export async function getBookInfo(url: string) {
  const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
    method: "POST",
    body: JSON.stringify([{ url }]),
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.log({ err }));

  const snapshotId = resp.snapshot_id;
  if (snapshotId) {
    for (let i = 0; i < 20; i++) {
      console.log("Wait", i);
      await wait(i === 0 ? 15000 : i < 5 ? 7000 : 15000);
      const resp = await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .catch(err => console.log({ err }));

      if (resp.status !== "running") {
        if (resp.status !== "ready") {
          return null;
        }
        const brightDataResult = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
            "Content-Type": "application/json"
          }
        }).then(res => res.json());

        return brightDataResult;
      }

      console.log("Snapshow wait", i, resp);
    }
  }
}
