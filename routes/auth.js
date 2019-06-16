const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const router = express.Router()

// User model
const User = require('../models/User')

// register
router.post('/register', (req, res, next) => {
  const { name, email, password } = req.body
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        res.status(400).send('😅 Email is already registered')
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save()
              .then(user => {
                res.send('Registered succeeded')
              })
              .catch(err => console.log(err))
          })
        })
      }
    })
})

// login
router.post('/login', (req, res, next) => {
  console.log(req.body)
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).send(info.message)
    }
    req.login(user, err => {
      if (err) {
        console.log('Hi here ...')
        res.send(err)
      }
      // generate a signed json web token and return it
      jwt.sign({ email: user.email, password: user.password }, 'vue-admin-secret7412', (err, token) => {
        return res.json({ email: user.email, token })
      })
    })
  })(req, res, next);
})

//logout

router.get('/logout', (req, res) => {
  req.logout();
  console.log('Logged out')
  return res.send()
})

module.exports = router;