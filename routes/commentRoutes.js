const express = require('express');
const router = express.Router();
const commentController = require('./../controllers/commentController')
const authController = require('./../controllers/authController')

router
    .route('/')
    .post(authController.protect, commentController.createComment)
    
router
    .route('/:id')
    .get(authController.protect, commentController.getComment)

module.exports = router;