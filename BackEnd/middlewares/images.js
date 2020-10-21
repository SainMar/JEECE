const multer = require('multer');

//Les types de fichiers autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Contient le chemin absolu de la photo du User
const storage = multer.diskStorage({
  //Ou on stocke l'image
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //Comment s'appelle l'image
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    //Extension autorisée de la photo
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');
