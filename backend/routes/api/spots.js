// backend/routes/api/spots.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { validateSpot, validateSpotImage, validateQuery, validateReview, validateBooking} = require('../../utils/validation');

const { spotExists, usersSpot, convertDate } = require('../../utils/error-handles')


//Get all spots
router.get('/', validateQuery, async (req, res, next) => {

  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;


  page = Number(page)
  size = Number(size);

  if (!page) page = 1
  if (!size) size = 20
  if (page > 10) page = 10;
  if (size > 20) size = 20;

  let pagination = {}
  if (parseInt(page) >= 1 && parseInt(size) >= 1) {
      pagination.limit = size
      pagination.offset = size * (page - 1)
  }

  const query = {
    where: {},
    include: [],
    ...pagination
  };

  const reviewInclude = {
    model: Review,
    attributes: ['stars']
  };
  query.include.push(reviewInclude);

  const imageInclude = {
    model: SpotImage,
    attributes: ['url', 'preview']
  };

  query.include.push(imageInclude);

  const latWhere = {}
  if (maxLat && !minLat) {
      latWhere.lat = {
      [Op.lte]: maxLat
    }
  } else if (!maxLat && minLat) {
      latWhere.lat = {
        [Op.gte]: minLat
    }
  } else if (maxLat && minLat) {
      latWhere.lat = {
        [Op.and]: {
        [Op.lte]: maxLat,
        [Op.gte]: minLat
    }
  }
}

  if (Object.keys(latWhere).length > 0) {
    query.where = {...query.where, ...latWhere};
  }

  const lngWhere = {}
  if (maxLng && !minLng) {
    lngWhere.lng = {
      [Op.lte]: maxLng
    }
  } else if (!maxLng && minLng) {
      lngWhere.lng = {
        [Op.gte]: minLng
    }
  } else if (maxLng && minLng) {
      lngWhere.lng = {
          [Op.and]: {
          [Op.lte]: maxLng,
          [Op.gte]: minLng
    }
  }
}

  if (Object.keys(lngWhere).length > 0) {
    query.where = {...query.where, ...lngWhere};
  }

  const priceWhere = {}
  if (maxPrice && !minPrice) {
      priceWhere.price = {
        [Op.lte]: maxPrice
    }
  } else if (!maxPrice && minPrice) {
      priceWhere.price = {
        [Op.gte]: minPrice
    }
  } else if (maxPrice && minPrice) {
      priceWhere.price = {
          [Op.and]: {
          [Op.lte]: maxPrice,
          [Op.gte]: minPrice
    }
  }
}

  if (Object.keys(priceWhere).length > 0) {
    query.where = {...query.where, ...priceWhere};
  }

  const spots = await Spot.findAll(query);

  const spotsArr = spots.map(spot => {
    const spotData = spot.toJSON();
    const { Reviews, SpotImages } = spotData;
    let avgRating = "No current ratings";
    if (Reviews.length > 0) {
        const sum = Reviews.reduce((acc, { stars }) => acc + stars, 0);
        avgRating = sum / Reviews.length;
    }
    spotData.avgRating = avgRating;
    let previewImage = "No preview image available";
    if (SpotImages.length > 0) {
        const previewImageData = SpotImages.find(({ preview }) => preview);
        if (previewImageData) {
            previewImage = previewImageData.url;
        }
    }
    spotData.previewImage = previewImage;
    delete spotData.Reviews;
    delete spotData.SpotImages;
    return spotData;
});

  if (!spotsArr.length) {
    res.json("Sorry, no current spots")
  } else {
    res.json({
        Spots: spotsArr,
        page: page,
        size: size
  });
}
});



//Get all spots from current user
router.get('/current', requireAuth, async (req, res, next) => {
  const user = req.user;

  // Use a join table to retrieve all spots that belong to the user
  const spots = await user.getSpots({
      include: [
          {
              model: Review,
              attributes: ['stars']
          },
          {
              model: SpotImage,
              attributes: ['url', 'preview']
          }
      ],
      through: {
          where: {
              userId: user.id
          }
      }
  });

  let ownedSpots = [];

  spots.forEach(spot => {
      let eachSpot = spot.toJSON();

      let count = spot.Reviews.length;
      let sum = 0;
      spot.Reviews.forEach((review) => sum += review.stars)
      let avg = sum / count;
      if (!avg) {
          avg = "No current ratings"
      };

      eachSpot.avgRating = avg;

      if (eachSpot.SpotImages.length > 0) {
          for (let i = 0; i < eachSpot.SpotImages.length; i++) {
              if (eachSpot.SpotImages[i].preview === true) {
                  eachSpot.previewImage = eachSpot.SpotImages[i].url;
              }
          }
      }

      if (!eachSpot.previewImage) {
          eachSpot.previewImage = "No preview image available";
      }

      if (!eachSpot.Reviews.length > 0) {
          eachSpot.Reviews = "No current reviews"
      }

      if (!eachSpot.SpotImages.length > 0) {
          eachSpot.SpotImages = "No current SpotImages"
      }

      delete eachSpot.SpotImages;
      delete eachSpot.Reviews;
      ownedSpots.push(eachSpot);
  })


  if (ownedSpots.length === 0) {
      res.json("Sorry, you don't own any spots")
  }

  res.json({
      Spots: ownedSpots
  })
});

//Get spot by spotid

router.get('/:spotId', spotExists, async (req, res, next) => {
  let { spotId } = req.params;
  let spot;

  try {
    spot = await Spot.findByPk(spotId);
    spot = spot.toJSON();
  } catch (error) {
    return res.status(400).json({ message: error.message });
}

  let count;
    try {
      count = await Review.count({
          where: {
          spotId: spotId
      }
    })
    } catch (error) {
        return res.status(400).json({ message: error.message });
  }
  spot.numReviews = count;

  let sum;
    try {
      sum = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (sum / count) {
    spot.avgStarRating = sum / count;
  } else {
    spot.avgStarRating = "No current ratings";
  }

  let spotImages;
  try {
    spotImages = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  if (spotImages.length > 0) {
    spot.SpotImages = spotImages;
  } else {
    spot.SpotImages = "No images listed"
}

  let owner;
  try {
    owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  spot.Owner = owner;

  return res.json(spot);

});

//Get all review by spotid

router.get('/:spotId/reviews', spotExists, async (req, res, next) => {
  const { spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  const reviews = await spot.getReviews({
    include: [
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        {
            model: ReviewImage,
            attributes: ['id', 'url']
        }
    ]
});

  let reviewsArr = [];
  reviews.forEach(review => {
    let eachReview = review.toJSON();

    if (!eachReview.ReviewImages.length > 0) {
        eachReview.ReviewImages = "No review images available"
    }

    reviewsArr.push(eachReview);
  })

  if (!reviewsArr.length) {
    return res.json("This spot has no reviews");
  }

  res.json({
    Reviews: reviewsArr
  });
});

//Create review for a spot by spotId
router.post('/:spotId/reviews', requireAuth, spotExists, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body

  const user = req.user;
  const spot = await Spot.findByPk(spotId);

  let existingReview = await Review.findOne({
      where: {
          spotId: spotId,
          userId: user.id
      }
  });

  if (existingReview) {
      return res.status(403).json({
          message: "User already has a review for this spot",
          statusCode: 403
      });
  }

  if (spot.ownerId === user.id) {
      return res.status(403).json({
          error: {
              title: "User cannot leave review for own spot",
              message: "This spot is owned by the current user"
          }
      });
  }

  const newReview = await spot.createReview({
      userId: user.id,
      spotId: spotId,
      review: review,
      stars: stars
  });

  res.status(201).json(newReview);
});

//Create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  let user = req.user;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  let newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
  })

  res.status = 201;
  return res.json(newSpot)
})

//Adding spotImg to spotId
router.post('/:spotId/images', requireAuth, spotExists, usersSpot, validateSpotImage, async (req, res, next) => {
  let { spotId } = req.params;
  let { url, preview } = req.body;

  const user = req.user;

  const spot = await Spot.findByPk(spotId);

  let spotImage = await spot.createSpotImage({
      url: url,
      preview: preview
  })

  res.json({
      id: spotImage.id,
      url: spotImage.url,
      preview: spotImage.preview
  });
})


//Edit a spot
router.put('/:spotId', requireAuth, spotExists, usersSpot, validateSpot, async (req, res, next) => {

  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(spotId);
  const user = req.user;

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save()

  res.json(spot);
})

//Delete a spot
router.delete('/:spotId', requireAuth, spotExists, usersSpot, async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);
  const user = req.user;

  spot.destroy();
  res.json({
      message: "Successfully deleted",
      statusCode: 200
  })
})

//Get all bookings for a Spot by Spotid
router.get('/:spotId/bookings', requireAuth, spotExists, async (req, res, next) => {
  const { spotId } = req.params;
  const user = req.user;

  const spot = await Spot.findByPk(spotId);

  let bookings = await spot.getBookings({
      include: {
          model: User,
          attributes: ["id", "firstName", "lastName"]
      }
  });

  if (!bookings.length > 0) {
      return res.json({
          message: "No bookings for current spot"
      })
  }

  const bookingsArr = [];
  bookings.forEach(booking => {
      booking = booking.toJSON();
      let eachBooking = createBookingObject(booking, user, spot);
      bookingsArr.push(eachBooking);
  });

  res.json({
      Bookings: bookingsArr
  });
});

function createBookingObject(booking, user, spot) {
  if (user.id !== spot.ownerId) {
      return {
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate
      };
  } else {
      return {
          User: booking.User,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
      };
  }
}


//Create booking for a spot by spotId

router.post('/:spotId/bookings', requireAuth, spotExists, validateBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const user = req.user;
  let { startDate, endDate } = req.body;
  startDate = convertDate(startDate);
  endDate = convertDate(endDate);

  // Check if start date is in the past
  if (startDate <= new Date()) {
      return next({
          title: "Can't make a booking in the past",
          statusCode: 403,
          message: "Start date cannot be before today"
      });
  }

  // Check if end date is before or on start date
  if (endDate <= startDate) {
      return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors: {endDate: "endDate cannot be on or before startDate"}
      })
  }

  // Check if user is the owner of the spot
  const spot = await Spot.findByPk(spotId);
  if (user.id === spot.ownerId) {
      return next({
          title: "Owner can't make booking for owned spot",
          status: 403,
          message: "Current user owns this spot"
      });
  }

  // Check for conflicting bookings
  const bookings = await spot.getBookings();
  const bookingConflict = checkBookingConflict(startDate, endDate, bookings);
  if (bookingConflict) {
      return next(bookingConflict);
  }

  // Create new booking
  let newBooking = await spot.createBooking({
      spotId: spotId,
      userId: user.id,
      startDate: startDate,
      endDate: endDate
  });
  return res.json(newBooking);
});

const checkBookingConflict = (startDate, endDate, bookings) => {
  for (let i = 0; i < bookings.length; i++) {
      const bookedStartDate = convertDate(bookings[i].startDate);
      const bookedEndDate = convertDate(bookings[i].endDate);

      if ((bookedStartDate <= startDate && bookedEndDate >= startDate) ||
          (bookedStartDate <= endDate && endDate <= bookedEndDate) ||
          (bookedStartDate >= startDate && bookedEndDate <= endDate)) {
          return {
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: {startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking"}
          };
      }
  }
  return null;
};


module.exports = router;