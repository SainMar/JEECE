//Objet User (Prénom, Nom, Email, Password)

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Prénom, Nom, Email, Password, Date de création et Photo
const user = mongoose.Schema({
  prenom: {type: String, required: true },
  nom: {type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type : String, required: true },
  date: { type: Date, required: true, default: Date.now },
  urlPhoto: { type: String, required: true, default: "null" }
});

//Garantie des objets uniques
user.plugin(uniqueValidator);

module.exports = mongoose.model('User', user);
