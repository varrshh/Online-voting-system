const { Image } = require('canvas');
const fs = require('fs');

// Convert encoding data into 8-bit binary form
function genData(data) {
  return data.split('').map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'));
}

function modPix(pix, data) {
  const datalist = genData(data);
  const lendata = datalist.length;
  const imdata = pix;

  for (let i = 0; i < lendata; i++) {
    let pixel = imdata.slice(i * 8, i * 8 + 8);

    for (let j = 0; j < 8; j++) {
      if (datalist[i][j] === '0' && pixel[j] % 2 !== 0) {
        pixel[j] -= 1;
      } else if (datalist[i][j] === '1' && pixel[j] % 2 === 0) {
        pixel[j] -= 1;
      }
    }

    // Set last pixel as flag to stop or continue reading
    if (i === lendata - 1) {
      if (pixel[7] % 2 === 0) pixel[7] += 1;
    } else {
      if (pixel[7] % 2 !== 0) pixel[7] -= 1;
    }

    imdata.set(pixel, i * 8);
  }
  return imdata;
}

function lsb_encode(data) {
  const img = new Image();
  img.src = 'path/to/source_image.png';
  const newImg = modPix(img.data, data);
  fs.writeFileSync('path/to/encoded_image.png', new Buffer.from(newImg));
}

function lsb_decode(filePath) {
  const img = new Image();
  img.src = filePath;
  let message = '';
  const imgData = img.data;

  for (let i = 0; i < imgData.length; i += 8) {
    const pixel = imgData.slice(i, i + 8);
    const binStr = pixel.map((val) => (val % 2 === 0 ? '0' : '1')).join('');
    const charCode = parseInt(binStr, 2);
    message += String.fromCharCode(charCode);
    if (pixel[7] % 2 !== 0) break;
  }

  return message;
}

module.exports = { lsb_encode, lsb_decode };
