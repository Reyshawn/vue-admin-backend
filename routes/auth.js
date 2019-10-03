const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const router = express.Router()

// User model
const User = require('../models/User')

function extractEmail(req) {
  let token = req.headers.authorization.split(' ')[1]

  // get payload from token
  let payload = Buffer.from(token.split('.')[1], 'base64').toString('ascii')
  let email = JSON.parse(payload).email
  return email
}

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
        res.cookie('access_token', token, { expires: new Date(Date.now() + 900000), httpOnly: true })
        return res.json({ email: user.email, token })
      })
    })
  })(req, res, next);
})

router.get('/user', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const email = extractEmail(req)
  try {
    const user = await User.findOne({ email })
    res.json({
      avatar: user.avatar,
      roles: user.roles,
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      homepage: user.homepage,
      company: user.company,
      education: user.education,
      introduction: user.introduction
    })
  } catch (err) {
    console.log(err)
  }
})

router.post('/user', passport.authenticate('jwt', { session: false }),async (req, res, next) => {
  const email = extractEmail(req)
  const user = await User.findOne({ email })
  const { name, gender, phone, address, homepage, company, education, introduction } = req.body
  // console.log(req.body)
  
  try {
    user.name = name
    user.gender = gender
    user.phone = phone
    user.address = address
    user.homepage = homepage
    user.company = company
    user.education = education
    user.introduction = introduction
    user.save()
    res.send('Update success')
  } catch (err) {
    console.log(err)
  }

})

//logout

router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('access_token')
  console.log('Logged out')
  return res.send('Logout succeeded.')
})

module.exports = router;
