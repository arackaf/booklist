import "./util/config";

const { BRIGHT_DATA_ZONE, BRIGHT_DATA_KEY, BRIGHT_DATA_API_KEY } = process.env;

async function main() {
  // const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
  //   method: "POST",
  //   body: JSON.stringify([{ url: "https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1492034029/" }]),
  //   headers: {
  //     Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
  //     "Content-Type": "application/json"
  //   }
  // })
  //   .then(res => {
  //     return res.json();
  //   })
  //   .catch(err => console.log({ err }));

  const snapshotId = "s_mbmp2at6av24nh62q";
  console.log({ snapshotId });

  fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      console.log("Got response");
      return res.json();
    })
    .then(data => {
      console.log("Got data");
      console.log(data);
    })
    .catch(err => console.log({ err }));
}

main();
