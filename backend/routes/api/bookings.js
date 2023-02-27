// backend/routes/api/bookings.js
const express = require('express');
const router = express.Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateBooking } = require('../../utils/validation');
const sequelize = require('sequelize');
const { bookingExists, convertDate } = require('../../utils/error-handles')


//Get bookings for curr user
router.get("/current", requireAuth, async (req, res, next) => {
  const user = req.user;

  const bookings = await user.getBookings({
      include: [{
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [{
              model: SpotImage,
              attributes: ['url']
          }]
      }]
  });

  if (bookings.length === 0) {
      return res.json({
          message: "No bookings for current spot"
      })
  }

  const bookingsArr = bookings.map(booking => {
      booking = booking.toJSON();
      if (booking.Spot.SpotImages.length > 0) {
          for (let i = 0; i < booking.Spot.SpotImages.length; i++) {
              if (booking.Spot.SpotImages[i].preview === true) {
                  booking.Spot.previewImage = booking.Spot.SpotImages[i].url;
              }
          }
      }

      if (!booking.Spot.previewImage) {
          booking.Spot.previewImage = "No preview image available";
      }

      delete booking.Spot.SpotImages;
      return {
          id: booking.id,
          spotId: booking.spotId,
          Spot: booking.Spot,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
      }
  });

  res.json({
      Bookings: bookingsArr
  });
});

//Edit booking
router.put('/:bookingId', requireAuth, bookingExists, validateBooking, async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;
  let { startDate, endDate } = req.body;
  startDate = convertDate(startDate);
  endDate = convertDate(endDate);

  let bookingEdit = await Booking.findByPk(bookingId);

  if (startDate <= new Date()) {
      return res.status(403).json({
          title: "Can't start a booking in the past",
          message: "Start date cannot be before today"
      })
  }

  bookingsStart = convertDate(bookingEdit.startDate);
  bookingsEnd = convertDate(bookingEdit.endDate);
  const spotId = bookingEdit.spotId;

  if (bookingsEnd > new Date()) {
      return res.status(403).json({
          message: "Past bookings can't be modified",
          statusCode: 403
      });
  };

  if (endDate <= startDate) {
      return res.status(400).json({
         message: 'Validation error',
         statusCode: 400,
         errors: {endDate: "endDate cannot come before startDate"}
      });
  };

  if (user.id !== bookingEdit.userId) {
      return res.status(403).json({
          message: "Forbidden",
          statusCode: 403
      });
  }

  const spot = await Spot.findByPk(spotId);

  const bookings = await spot.getBookings();

  for (const booking of bookings) {
      if (booking.id === bookingEdit.id) {

          bookStart = convertDate(booking.startDate);
          bookEnd = convertDate(booking.endDate);

          if (bookStart <= startDate && bookEnd >= startDate) {
              return res.status(403).json({
                  message: "Sorry, this spot is already booked for the specified dates",
                  statusCode: 403,
                  errors: { startDate: "Start date conflicts with an existing booking" }
              });
          } else if (bookStart <= endDate && endDate <= bookEnd) {
              return res.status(403).json({
                  message: "Sorry, this spot is already booked for the specified dates",
                  statusCode: 403,
                  errors:  { endDate: "End date conflicts with an existing booking" }      
              });
          } else if (bookStart >= startDate && bookEnd <= endDate) {
              return res.status(403).json({
                  message: "Sorry, this spot is already booked for the specified dates",
                  statusCode: 403,
                  errors: { startDate: "Start date conflicts with an existing booking", endDate: "End date conflicts with an existing booking"}
              });
          }
      }
  }

  bookingEdit.startDate = startDate;
  bookingEdit.endDate = endDate;
  bookingEdit.save();
  res.json(bookingEdit)
})



//Delete booking
router.delete('/:bookingId', restoreUser, requireAuth, async (req, res, next) => {

  const { user } = req

  const bookingId = req.params.bookingId

  if(!bookingId || bookingId === 'null'){
      return res.status(404).json({
          message: "Booking couldn't be found",
          statusCode: 404
      })
  }

  const findBooking = await Booking.findByPk(bookingId)

  if(!findBooking){
      return res.status(404).json({
          message: "Booking couldn't be found",
          statusCode: 404
      })
  }

  if(findBooking.dataValues.userId !== user.id){
      return res.status(400).json({
          message: "Validation error",
          statusCode: 400
      })
  }

  if(new Date(findBooking.dataValues.startDate) <= new Date()){
      return res.status(403).json({
          message: "Bookings that have been started can't be deleted",
          statusCode: 403
      })
  }

  await findBooking.destroy()

  return res.status(200).json({
      message: "Successfully deleted",
      statusCode: 200
  })

})

module.exports = router;