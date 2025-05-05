const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

//setting up multer for storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //getting path
    const uploadPath = path.join(__dirname, 'uploads');
    //checking if the upload actually exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    //call back to save file
    cb(null, uploadPath);
  },
  //creating name with date so everything is unique 
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});


const upload = multer({ storage: storage });

//handling the file upload
router.post('/', upload.single('image'), (req, res) => {
    const { title, blurb } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    //ensuring all fields are meet
    if (!title || !blurb || !imagePath) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    //format for art in json file
    const newArt = {
        title,
        blurb,
        imagePath,
        uploadedAt: new Date()
    };

    //adding the art data to the art data file
    const dataPath = path.join(__dirname, 'artData.json');
    let existing = [];

    if (fs.existsSync(dataPath))
    {
        existing = JSON.parse(fs.readFileSync(dataPath));
    }

existing.push(newArt);

fs.writeFileSync(dataPath, JSON.stringify(existing, null, 2));

  

  //confirmation
    console.log('Art has been uploaded:', newArt);
    res.status(200).json(newArt);
});

module.exports = router;
