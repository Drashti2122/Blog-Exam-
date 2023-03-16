const express = require('express')
const likeController = require('./../controllers/likeController')
const authController = require('./../controllers/authController')
const router = express.Router();

router.
    route('/')
    .post(authController.protect, likeController.aboutLike)
    .delete(authController.protect, likeController.aboutLike)

router
    .route('/getMostLikedBlog/:lmt?')
    .get(authController.protect, likeController.getMostLikedBlog)

module.exports = router;