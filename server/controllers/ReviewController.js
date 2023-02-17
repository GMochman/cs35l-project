const { body, validationResult } = require("express-validator");
const Review = require("../models/Review");

exports.review_post = [
  body("user")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("The user field is required"),
  body("post")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("The post field is required"),

  async (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json({ err });
    }

    const newReviewPost = new Review({
      user: req.body.user,
      post: req.body.post,
      likes: [],
      date_posted: new Date(),
    });

    await newReviewPost.save((err) => {
      if (err) {
        return res.status(400).json({ err });
      }

      return res.status(201).json(newReviewPost);
    });
  },
];
