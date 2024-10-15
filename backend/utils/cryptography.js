// const crypto = require('crypto');
// const aes256 = require('aes256');
// const fs = require('fs');

// // Encryption key for AES-256
// const encryptionKey = '65ff36214854370b50911846d61dc754789f1ded5c33ec2a38e25d88c90f3cca';

// const crypto = require('crypto');
// const aes256 = require('aes256');
// const sharp = require('sharp');
// const fs = require('fs');

// // Encryption key for AES-256
// const encryptionKey = '65ff36214854370b50911846d61dc754789f1ded5c33ec2a38e25d88c90f3cca';



// // Visual Cryptography - Creating shares
// function createShares(vote) {
//   let voteBin = parseInt(vote).toString(2).padStart(8, '0');
//   let share1 = '';
//   let share2 = '';

//   for (let i = 0; i < voteBin.length; i++) {
//     let bit1 = Math.floor(Math.random() * 2);
//     let bit2 = bit1 ^ parseInt(voteBin[i]); // XOR operation
//     share1 += bit1;
//     share2 += bit2;
//   }
//   return [share1, share2];
// }

// // Steganography - Embedding share in image
// async function embedShareInImage(share, imagePath) {
//   const image = await sharp(imagePath)
//     .raw()
//     .ensureAlpha() 
//     .toBuffer({ resolveWithObject: true });

//   const { data, info } = image;

//   for (let i = 0; i < share.length && i < data.length; i++) {
//     data[i] = (data[i] & ~1) | parseInt(share[i]);
//   }

//   await sharp(data, {
//     raw: {
//       width: info.width,
//       height: info.height,
//       channels: info.channels,
//     },
//   }).toFile('output_image.png'); 
// }

// // AES-256 Encryption
// function encryptVote(vote) {
//   return aes256.encrypt(encryptionKey, vote);
// }

// // AES-256 Decryption
// function decryptVote(encryptedVote) {
//   return aes256.decrypt(encryptionKey, encryptedVote);
// }

// // Extracting share from image
// async function extractShareFromImage(imagePath) {
//   const image = await sharp(imagePath)
//     .raw()
//     .ensureAlpha()
//     .toBuffer({ resolveWithObject: true });

//   const { data } = image;
//   let extractedShare = '';

//   for (let i = 0; i < data.length; i++) {
//     extractedShare += (data[i] & 1).toString();
//   }

//   return extractedShare;
// }

// function reconstructVote(share, encryptedVote) {
//   // First, decrypt the encrypted vote
//   const decryptedVote = decryptVote(encryptedVote);
  
//   if (!decryptedVote || decryptedVote.length === 0) {
//     throw new Error('Decryption failed or resulted in an empty string.');
//   }

//   // Convert the decrypted vote to binary
//   let voteBin = parseInt(decryptedVote).toString(2).padStart(8, '0');

//   // Create expected shares from the decrypted vote
//   const [expectedShare1, expectedShare2] = createShares(voteBin);

//   // Check if the provided share matches the expected share
//   if (share !== expectedShare1 && share !== expectedShare2) {
//     throw new Error('Provided share does not match expected shares.');
//   }

//   // Assuming the decrypted vote is valid and corresponds to a candidate ID
//   return decryptedVote;
// }


// module.exports = {
//   createShares,
//   embedShareInImage,
//   encryptVote,
//   decryptVote,
//   extractShareFromImage,
//   reconstructVote,
// };
const crypto = require('crypto');

// Encrypt the candidate ID
function encryptVote(candidateId) {
  const cipher = crypto.createCipher('aes-256-cbc', '65ff36214854370b50911846d61dc754789f1ded5c33ec2a38e25d88c90f3cca'); // Use a strong key
  let encrypted = cipher.update(candidateId, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt the encrypted vote
function decryptVote(encryptedVote) {
  const decipher = crypto.createDecipher('aes-256-cbc', '65ff36214854370b50911846d61dc754789f1ded5c33ec2a38e25d88c90f3cca');
  let decrypted = decipher.update(encryptedVote, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptVote, decryptVote };
