const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController')

router.post('/signUp', authController.signUp)
router.post('/signIn', authController.signIn)

router.post('/logout', authController.protect, authController.logout)
module.exports = router;