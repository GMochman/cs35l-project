const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController')

router.post('/:id', ReviewController.review_post);

module.exports = router;