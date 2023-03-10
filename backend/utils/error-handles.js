const sequelize = require('sequelize');
const express = require('express');
const router = express.Router();
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../db/models');

const convertDate = (date) => {
  const [year, month, day] = date.split("-");
  const monthIndex = month - 1;
  const newDate = new Date(year, monthIndex, date)
  return date;
}


const spotExists = async (req, res, next) => {
  let { spotId } = req.params;
  let spot = await Spot.findByPk(spotId);

  if (!spot) {
    //   let err = {};
    //   err.title = "Not found"
    //   err.response = "Couldn't find a Spot with the specified id"
    //   err.status = 404;
    //   err.message = "Spot couldn't be found";
    //   return next(err);
    return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
  }
  return next();
};


const usersSpot = async (req, res, next) => {
  let { spotId } = req.params;
  const user = req.user;
  const spot = await Spot.findByPk(spotId);

  if (user.id !== spot.ownerId) {
    //   const err = {};
    //   err.title = "Authorization error";
    //   err.status = 403;
    //   err.message = "Spot doesn't belong to current user";
    //   return next(err);
    return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
    })
  }
  return next();
};

const usersReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const user = req.user
  const review = await Review.findByPk(reviewId);

  if (review.userId !== user.id) {
    //   const err = {};
    //   err.title = "Authorization error";
    //   err.status = 403;
    //   err.message = "Review doesn't belong to current user";
    //   return next(err);
    return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
    })
  }
  return next();
};

// If Review exists for Review
const reviewExists = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId)

  if (!review) {
    //   const err = {}
    //   err.title = "Couldn't find a Review with the specified id";
    //   err.message = "Review couldn't be found";
    //   err.status = 404;
    //   return next(err)
    return res.status(404).json({
        message: "Review couldn't be found",
        statusCode: 404
    })
  };
  return next();
};

// If Booking exists for Booking
const bookingExists = async (req, res, next) => {
  const { bookingId } = req.params;
  let booking = await Booking.findByPk(bookingId);

  if (!booking) {
    //   const err = {};
    //   err.title = "Couldn't find a booking with the specific id"
    //   err.status = 404;
    //   err.message = "Booking couldn't be found";
    //   return next(err)
    return res.status(404).json({
        message: "Booking couldn't be found",
        statusCode: 404
    })
  }
  return next();
};

const usersBooking = async(req, res, next) => {
  const { bookingId } = req.params;
  const user = req.user
  const booking = await Booking.findByPk(bookingId);

  if (booking.userId !== user.id) {
    //   const err = {};
    //   err.title = "Authorization error";
    //   err.status = 403;
    //   err.message = "Review doesn't belong to current user";
    //   return next(err);
    return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
    })
  }
  return next();
}


module.exports = {
  spotExists,
  usersSpot,
  usersReview,
  reviewExists,
  bookingExists,
  convertDate
}