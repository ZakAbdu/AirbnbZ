// backend/routes/api/reviews.js
const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateReview, validateReviewImage } = require('../../utils/validation');
const sequelize = require('sequelize');
const { reviewExists, usersReview } = require('../../utils/error-handles')

//Get reviews of current user
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
      const reviews = await Review.findAll({
          where: {
              userId: userId
          },
          include: [
              {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName']
              },
              {
                  model: Spot,
                  attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                  include: [{
                      model: SpotImage,
                      attributes: ['url', 'preview']
                  }]
              },
              {
                  model: ReviewImage,
                  attributes: ['id', 'url']
              }
          ]
      });

      if (reviews.length === 0) {
          return res.status(204).json({ message: 'No reviews found for current user.' });
      }

      let reviewArr = [];
      for (const review of reviews) {
          let eachReview = review.toJSON();
          if (eachReview.Spot.SpotImages.length > 0) {
              let previewImage;
              for (const spotImage of eachReview.Spot.SpotImages) {
                  if (spotImage.preview === true) {
                      previewImage = spotImage.url;
                      break;
                  }
              }
              eachReview.Spot.previewImage = previewImage || 'No preview image available';
          } else {
              eachReview.Spot.previewImage = 'No preview image available';
          }

          delete eachReview.Spot.SpotImages;
          reviewArr.push(eachReview);
      }

      res.json({ Reviews: reviewArr });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews for current user.' });
  }
});



//Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, reviewExists, usersReview, validateReviewImage, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user;

    const review = await Review.findByPk(reviewId);

    const reviewImages = await review.getReviewImages();

    if (reviewImages.length >= 10) {
    return res.status(404).json({
        message: "Maximum number of images for this resource was reached.",
        statusCode: 403,
      })
  }

    const newImage = await review.createReviewImage({ url });

    res.json({
    id: newImage.id,
    url: newImage.url
})

    //   try {
//     const { reviewId } = req.params;
//     const { url } = req.body;
//     const user = req.user;

//     const review = await Review.findByPk(reviewId);

//     let allReviewImages = await review.getReviewImages();

//     if (allReviewImages.length >= 10) {
//       const error = new Error("Cannot add any more images because there is a maximum of 10 images per resource");
//       error.message = "Maximum number of images for this resource was reached";
//       error.status = 403;
//       throw error;
//     }

//     const newReviewImage = await review.createReviewImage({
//         url: url
//     });

//     res.json({
//         id: newReviewImage.id,
//         url: newReviewImage.url
//     });
//   } catch (error) {
//     next(error);
//   }

});

//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, reviewExists, usersReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const user = req.user;

  let editReview = await Review.findByPk(reviewId);

  editReview.review = review;
  editReview.stars = stars;

  await editReview.save();

  return res.json(editReview);
})


//Delete review
router.delete("/:reviewId", requireAuth, reviewExists, usersReview, async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user;

  let review = await Review.findByPk(reviewId);

  review.destroy();

  return res.json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;