const express = require('express');
const stuffCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const router = express.Router();

router.get('/', auth, stuffCtrl.getAllThings);
router.post('/', auth,  multer, stuffCtrl.createThing)
router.get('/:id', auth, stuffCtrl.findOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing)
router.delete('/:id', auth, stuffCtrl.deleteThing)


module.exports = router;