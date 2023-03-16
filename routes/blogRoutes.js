const express = require('express')
const multer = require('multer')
const router = express.Router();
const blogController = require('./../controllers/blogController')
const authController = require('./../controllers/authController')


router
    .route('/')
    .post(authController.protect, blogController.uploadBlogImages, blogController.resizeUserPhoto, blogController.createBlog)
    .get(authController.protect, blogController.getBlog)

router
    .route('/:id')
    .delete(authController.protect, blogController.deleteBlog)
    .patch(authController.protect, blogController.uploadBlogImages, blogController.resizeUserPhoto, blogController.editBlog)

router
    .route('/getBlogByTopic/:id')
    .get(authController.protect, blogController.getBlogByTopic)

router
    .route('/getMostRecentBlog/:cnt')
    .get(authController.protect, blogController.getMostRecentBlog)

module.exports = router;