const express = require('express');
const router = express.Router();
const topicController = require('./../controllers/topicController')
const authController = require('./../controllers/authController')

router
    .route('/')
    .post(authController.protect, topicController.createTopic)
    .get(authController.protect, topicController.getTopic)

router
    .route('/:id')
    .delete(authController.protect, topicController.deleteTopic)
module.exports = router;
