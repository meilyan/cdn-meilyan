const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const imaegController = require('../controllers/imageController');

router.post('/upload', auth, upload.single('image'), imaegController.uploadImage);

module.exports = router;