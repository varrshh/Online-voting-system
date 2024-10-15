const crypto = require('crypto');

// Generate a random AES key
function generateAESKey(length = 256) { // Default to 256 bits
  if (![128, 192, 256].includes(length)) {
    throw new Error('Invalid key length. Must be 128, 192, or 256 bits.');
  }
  return crypto.randomBytes(length / 8).toString('hex'); // Convert to hex string
}

// Example usage
const aesKey = generateAESKey(256);
console.log('Generated AES Key:', aesKey);
