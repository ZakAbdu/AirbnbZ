// backend/routes/api/spot-images.js
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

  const image = await SpotImage.findByPk(imageId);

  if (!image) {
      return res.status(404).json({
          message: "Spot Image couldn't be found",
          statusCode: 404
      });
  }

  const spot = await image.getSpot();
  if (userId !== spot.ownerId) {
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