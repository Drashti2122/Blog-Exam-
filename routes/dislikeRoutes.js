const express = require('express')
const dislikeController = require('./../controllers/dislikeController')
const authController = require('./../controllers/authController')
const router = express.Router();

router.
    route('/')
    .post(authController.protect, dislikeController.aboutDislike)
    .delete(authController.protect, dislikeController.aboutDislike)

module.exports = router;