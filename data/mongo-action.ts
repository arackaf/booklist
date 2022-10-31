export function xya() {
  console.log("Yooooo");
}

export function runAction(action, payload) {
  return 12;
  fetch(process.env.MONGO_URL + "/action/" + action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*"
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log("SUCCESS", res);
      return res;
    })
    .catch(err => {
      console.log({ err });
    });
}
