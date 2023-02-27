// backend/routes/api/session.js
const express = require('express')
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateLogin = [
  check('credential')
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

// Log in
router.post(
  '/',
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if(!credential && !password) {
        res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: {
                credential: 'Email or username is required',
                password: "Password is required"
            }
        })
    }


    if (!user) {
    //   const err = new Error('Login failed');
    //   err.status = 401;
    //   err.title = 'Login failed';
    //   err.errors = ['The provided credentials were invalid.'];
    //   return next(err);
    return res.status(401).json({
        message: 'Invalid credentials',
        statusCode: 401
    })
    }
    

    await setTokenCookie(res, user);

    return res.json({ 'user': {

        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username

    }
    });
  }
);


// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Restrore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
      const { user } = req;
      if (user) {
          return res.json({ 'user': {

              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,

            }
          });
      } else return res.json({ user: null });
  }
);

module.exports = router;