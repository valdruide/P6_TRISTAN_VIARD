const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //hash le pwd 10 fois avec bcrypt
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save() //sauvegarde le user
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //cherche l'email dans la bdd
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'login/mot de passe incorrect'});
            }
            bcrypt.compare(req.body.password, user.password) //compare le mdp dans la bdd et celui donné par le user
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'login/mot de passe incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //donne un token au user valide 24H
                            { userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};