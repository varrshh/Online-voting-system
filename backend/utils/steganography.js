const fs = require('fs');

// Embed the encrypted vote into the image
async function embedVoteInImage(encryptedVote, imageFile) {
  const binaryVote = encryptedVote.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
  
  const imageBuffer = fs.readFileSync(imageFile);
  const imageArray = [...imageBuffer];
  
  for (let i = 0; i < binaryVote.length; i++) {
    imageArray[i] = (imageArray[i] & ~1) | (binaryVote[i] === '1' ? 1 : 0);
  }
  
  const stegoImagePath = '/uploads/embeddedImage.png'; // Adjust the path
  fs.writeFileSync(stegoImagePath, Buffer.from(imageArray));
  return stegoImagePath;
}

// Extract the embedded vote from the image
async function extractVoteFromImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const binaryVote = [];
  
  for (let i = 0; i < imageBuffer.length; i++) {
    binaryVote.push((imageBuffer[i] & 1).toString());
  }
  
  const encryptedVote = binaryVote.join('').match(/.{1,8}/g)
    .map(byte => String.fromCharCode(parseInt(byte, 2)))
    .join('');
  
  return encryptedVote; // Returns the encrypted vote
}

module.exports = { embedVoteInImage, extractVoteFromImage };
