const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')



router.post('/signup', userCtrl.signup) //méthode signup de User
router.post('/login', userCtrl.login) //méthode login de User


module.exports = router