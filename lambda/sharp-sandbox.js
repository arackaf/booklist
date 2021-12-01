import fetch from "node-fetch";
import sharp from "sharp";

const downloadFromUrl = url => {
  return new Promise(res => {
    fetch(url)
      .then(res => res.arrayBuffer())
      .then(body => res({ body: Buffer.from(body) }))
      .catch(err => res({ error: true, msg: err }));
  });
};

async function go() {
  const { body, error } = await downloadFromUrl("https://images-na.ssl-images-amazon.com/images/I/510FXFd+04L._SX379_BO1,204,203,200_.jpg");
  sharp(body).resize(80, undefined, { withoutEnlargement: true }).toFile("./junk.jpg");
}

go();
