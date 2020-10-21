//Objet Message (Prénon, Nom, Message)

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Room, Contenu, idSend, idRecv, Date de création
const message = mongoose.Schema({
  room: { type: String, required: true},
  contenu: { type: String, required: true },
  idSend: { type: Number, required: true },
  idRecv: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
});

 //Garantie des objets uniques
message.plugin(uniqueValidator);

module.exports = mongoose.model('Message', message);
