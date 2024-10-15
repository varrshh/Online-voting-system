const { encryptVote, decryptVote } = require('./cryptography');

const vote = "123"; // Example vote
const encryptedVote = encryptVote(vote);
console.log('Encrypted Vote:', encryptedVote);

const decryptedVote = decryptVote(encryptedVote);
console.log('Decrypted Vote:', decryptedVote);