//copied this function from another assignment
//this stores a hashed password for the simple login I have
const bcrypt = require('bcrypt');
const fs = require('fs');

const username = 'admin';
const password = 'mypassword';

//hashing and storing password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  const data = { username, hashedPassword: hash };
  fs.writeFileSync('./server/credentials.json', JSON.stringify(data, null, 2));
  console.log(' Credentials saved');
});
