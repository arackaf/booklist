const _fetch = import("node-fetch");

module.exports.downloadImage = async url => {
  const fetch = (await _fetch).default;

  return new Promise(res => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(body => res({ body }))
      .catch(err => res({ error: true, msg: err }));
  });
};
