import "./util/config";

const { BRIGHT_DATA_ZONE, BRIGHT_DATA_KEY, BRIGHT_DATA_API_KEY } = process.env;

async function main() {
  // const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
  //   method: "POST",
  //   body: JSON.stringify([
  //     { url: "https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1492034029/" },
  //     { url: "https://www.amazon.com/Site-Reliability-Engineering-Production-Systems/dp/149192912X" },
  //     { url: "https://www.amazon.com/Monolith-Microservices-Evolutionary-Patterns-Transform/dp/1492047848" },
  //     { url: "https://www.amazon.com/Deciphering-Data-Architectures-Warehouse-Lakehouse/dp/1098150767" },
  //     { url: "https://www.amazon.com/Philosophy-Software-Design-2nd/dp/173210221X" }
  //   ]),
  //   headers: {
  //     Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
  //     "Content-Type": "application/json"
  //   }
  // })
  //   .then(res => {
  //     return res.json();
  //   })
  //   .catch(err => console.log({ err }));

  //console.log(resp);
  //return;

  const snapshotId = "s_mbo4x8cs1ebt8oth57";
  console.log({ snapshotId });

  await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
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

  await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
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
      //console.log(data);
      console.log({ data });
    })
    .catch(err => console.log({ err }));

  return;

  fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      console.log("Got response");
      return res.text();
    })
    .then(data => {
      console.log("Got data");
      //console.log(data);
      const json = JSON.parse("[" + data + "]");
      console.log(json);
    })
    .catch(err => console.log({ err }));
}

main();
