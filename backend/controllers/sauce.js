
const Sauce = require('../models/sauce')
const fs = require('fs')

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Sauce({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });
  
    thing.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

exports.modifyThing = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié'}))
        .catch(error => res.status(400).json({ error }))
};

exports.deleteThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
       .then(thing => {
           if (thing.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = thing.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.findOneThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }))
};


exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    
    switch (like) {
      case 1 :
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))
              
        break;
  
      case 0 :
            Sauce.findOne({ _id: sauceId })
             .then((sauce) => {
              if (sauce.usersLiked.includes(userId)) { 
                Thing.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
              if (sauce.usersDisliked.includes(userId)) { 
                Thing.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
            })
            .catch((error) => res.status(404).json({ error }))
        break;
  
      case -1 :
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
            .catch((error) => res.status(400).json({ error }))
        break;
        
        default:
          console.log(error);
    }
  }