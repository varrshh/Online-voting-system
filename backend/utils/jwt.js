const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log(jwtSecret);  // This will print a long random string