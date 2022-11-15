const multer = require('multer');

const MIME_TYPES = { //images acceptées
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //supprime les espaces dans le nom du fichier
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); 
  }
});

module.exports = multer({storage: storage}).single('image');