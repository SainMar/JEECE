//Librairie qui contient le msgSchema (modèle de données d'un message)
const Message = require('../objets/msgSchema.js');
var ObjectID = require('mongodb').ObjectID;

//Envoyer un message
exports.sendMsg = (req, res, next) => {
  const message = new Message({
    ...req.body
  });
  //Sauvegarde du message
  message.save()
    .then(message => res.status(201).json({ message: 'Message créé !' }))
    .catch(error => res.status(400));
};

//Recevoir un message
exports.recvMsg = (req, res, next) => {
  //Chargement de tous les messages de la room
  console.log('backend recevoir msg')
  console.log(req.params.room)
  Message.find({room: req.params.room})
    .then(messagesRcv => res.send(messagesRcv))
    .catch(error => error.status(400));
};


//Page d'accueil
exports.pageAccueil = (req, res, next) => {
 
  //Chargement de tous les derniers messages de chaque room

  Message.aggregate([
    {
      $match: { $or: [{ idSend: ObjectID(req.body.userId) }, { idRecv: ObjectID(req.body.userId) }] }
    }, {
      $sort: {date: 1}
    }, {
      $group: {
        _id: "$room",
        contenu: {$first : "$contenu"},
        idSend: {$first : "$idSend"},
        idRecv: {$first : "$idRecv"},
        date: {$last: "$date"},
      }
    },{
      $lookup: {
        from: "users",
        localField: "idSend",
        foreignField: "_id",
        as:"userSender"
      }
    },{
      $lookup: {
        from: "users",
        localField: "idRecv",
        foreignField: "_id",
        as:"userRecver"
      }
    }])
  .then(messagesAcc => res.send(messagesAcc))
  .catch(error => {
    res.status(400).json({ error })
  });
};
