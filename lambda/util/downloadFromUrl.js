import fetch from "node-fetch";

export default url => {
  return new Promise(res => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(body => res({ body }))
      .catch(err => res({ error: true, msg: err }));
  });
};
