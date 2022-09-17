const express = require('express');
const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const router = express.Router();

router.get('/', auth, sauceCtrl.getAllThings);
router.post('/', auth,  multer, sauceCtrl.createThing)
router.get('/:id', auth, sauceCtrl.findOneThing);
router.put('/:id', auth, sauceCtrl.modifyThing)
router.delete('/:id', auth, sauceCtrl.deleteThing)
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce)


module.exports = router;


