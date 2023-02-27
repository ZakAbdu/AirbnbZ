// backend/routes/api/review-images.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');


router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { id: userId } = req.user;

  const image = await ReviewImage.findByPk(imageId);

  if (!image) {
      return res.status(404).json({
        message: "Review Image couldn't be found",
        statusCode: 404
      })
  }

  const review = await image.getReview();
  if (userId !== review.userId) {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403
      })
  }

  await image.destroy();

  res.json({
      message: "Successfully deleted",
      statusCode: 200
  });
});

module.exports = router;