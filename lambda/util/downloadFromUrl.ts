import fetch from "node-fetch";
import path from "path";

export default (url, minSizeToAccept = null) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(body => ({ body: Buffer.from(body) }))
    .then(packet => {
      if (minSizeToAccept && packet.body.byteLength < minSizeToAccept) {
        return null;
      } else {
        return packet;
      }
    })
    .then(packet => (packet ? { ...packet, ext: path.extname(url) || ".jpg" } : null))
    .catch(err => ({ error: true, msg: err }));
};
