import { isbn13To10 } from "../util/isbn13to10";

require("dotenv").config({ path: "./scratch/.env" });

const isbns = ["9780805069075"].map(isbn => isbn13To10(isbn)!);
const BRIGHT_DATA_API_KEY = process.env.BRIGHT_DATA_API_KEY!;

run();

async function run() {
  const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
    method: "POST",
    body: JSON.stringify(isbns.map(isbn => ({ url: `https://www.amazon.com/dp/${isbn}` }))),
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  }).then(res => res.json());

  const { snapshot_id } = resp;

  console.log("Snapshot ID Found:", snapshot_id);

  if (!snapshot_id) {
    throw new Error("No snapshot ID");
  }

  return pollForSnapshot(snapshot_id, BRIGHT_DATA_API_KEY);
}

const pollForSnapshot = async (snapshotId: string, BRIGHT_DATA_API_KEY: string) => {
  for (let i = 0; i < 40; i++) {
    await wait(i < 20 ? 5000 : 10000);

    const progress = await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());

    console.log("Snapshot Progress:", progress);
    if (progress.status === "running") {
      continue;
    }

    if (progress.status === "ready") {
      const snapshotData = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []));

      console.log("Snapshot Data:", snapshotData);
      return;
    }
  }

  throw new Error("Snapshot timed out");
};

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
