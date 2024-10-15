const { Image } = require('canvas');
const fs = require('fs');
const path = require('path');

function generate_shares(imageData) {
  const data = new Uint8Array(imageData);
  const img1 = new Uint8Array(data.length);
  const img2 = new Uint8Array(data.length);

  for (let i = 0; i < data.length; i++) {
    const randomVal = Math.random() * 256;
    img1[i] = randomVal;
    img2[i] = data[i] ^ randomVal;
  }

  fs.writeFileSync('images/pic1.png', img1);
  fs.writeFileSync('images/pic2.png', img2);
}

function compress_shares(share1Path, share2Path) {
  const img1 = fs.readFileSync(share1Path);
  const img2 = fs.readFileSync(share2Path);

  const compressed = img1.map((byte, i) => byte & img2[i]);
  fs.writeFileSync('images/compressed.png', compressed);
}

module.exports = { generate_shares, compress_shares };
