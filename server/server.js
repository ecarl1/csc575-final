const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'client')));


//uploading images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//route for getting art to display
const fs = require('fs');
const artPath = path.join(__dirname, 'artData.json');

app.get('/art', (req, res) => {
  if (fs.existsSync(artPath)) {
    const data = JSON.parse(fs.readFileSync(artPath));
    res.json(data);
  } else {
    res.json([]);
  }
});

//upload route
const uploadRoute = require('./upRoute');
app.use('/api/upload', uploadRoute);


//test route
app.get('/', (req, res) => {
  res.send(' Server working');
});

//starts server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

const bcrypt = require('bcrypt');
const credentialsPath = path.join(__dirname, 'credentials.json');

//route for user login
//I got lazy and didn't want to put this on a separate file
app.post('/api/login', async (req, res) => {
    
    //getting the username and password from request body
    const { username, password } = req.body;

    if (!fs.existsSync(credentialsPath)) return res.status(500).json({ error: 'Login system not configured.' });

    //getting the stored user credentials
    const { username: storedUser, hashedPassword } = JSON.parse(fs.readFileSync(credentialsPath));

    //comparing the stored hashed password with the user entered password
    const userMatch = username === storedUser;
    const passMatch = await bcrypt.compare(password, hashedPassword);

    if (userMatch && passMatch) {
        return res.status(200).json({ message: 'Login works' });
    }

    res.status(401).json({ error: 'Invalid username or password' });
});




