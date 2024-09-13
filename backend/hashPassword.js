const bcrypt = require('bcryptjs');

// Define your password to hash
const password = 'admin123';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
  });
});
