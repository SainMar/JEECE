//Librairie qui contient le msgSchema (modèle de données d'un message)
const Message = require('../objets/msgSchema.js');



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
  Message.find({room: req.params.room})
    .then(messagesRcv => res.send(messagesRcv))
    .catch(error => error.status(400));
};


//Page d'accueil
exports.pageAccueil = (req, res, next) => {
 
  //Chargement de tous les derniers messages de chaque room
  Message.aggregate([{
    $match: { $or: [{ idSend: req.body.userId }, { idRecv: req.body.userId }] }
  }, {
    $sort: {date: 1}
  }, {
    $group: {
      _id: "$room",
      _contenu: {$first : "$contenu"},
      _idSend: {$first : "$idSend"},
      _idRecv: {$first : "$idRecv"},
      lastMsg: {$last: "$date"}
    }
  }])
  .then(messagesAcc => res.send(messagesAcc))
  .catch(error => error.status(400));
};
