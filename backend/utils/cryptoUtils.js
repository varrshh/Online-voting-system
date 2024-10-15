const crypto = require('crypto');
const fs = require('fs');

// AES encryption for candidate ID
function encryptVote(candidateId) {
  const cipher = crypto.createCipher('aes-256-cbc', 'your-secret-key');
  let encrypted = cipher.update(candidateId.toString(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Embed encrypted vote in image (simplified without Jimp)
function embedVoteInImage(encryptedVote, imageFilePath) {
  const image = fs.readFileSync(imageFilePath);
  const binaryVote = encryptedVote.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');

  const modifiedImage = Buffer.from(image); // Clone the image

  // Simple LSB Steganography (example)
  for (let i = 0; i < binaryVote.length; i++) {
    modifiedImage[i] = (image[i] & 0xFE) | parseInt(binaryVote[i], 2);
  }

  const newImagePath = 'uploads/embedded_vote_image.png'; // Example output path
  fs.writeFileSync(newImagePath, modifiedImage);
  return newImagePath;
}

// Extract vote from image
function extractVoteFromImage(imageFilePath) {
  const image = fs.readFileSync(imageFilePath);
  let binaryVote = '';

  for (let i = 0; i < image.length; i++) {
    binaryVote += (image[i] & 1).toString(); // Extract LSB from image
  }

  const encryptedVote = binaryVote.match(/.{1,8}/g).map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  return encryptedVote;
}

module.exports = { encryptVote, embedVoteInImage, extractVoteFromImage };
