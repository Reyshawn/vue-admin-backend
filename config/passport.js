const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Load User Model
const User = require('../models/User')

const JWTStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: '😔 That email is not registered! '})
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false,  { message: '😱 Password incorrect '})
            }
          })
        })
        .catch(err => console.log(err))
    })
  )

  passport.use(
    new JWTStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'vue-admin-secret7412'
    }, (jwtPayload, done) => {
      console.log('jwtPayload:', jwtPayload)
      User.findOne({ email: jwtPayload.email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: '😔 That email is not registered! '})
          }
          return done(null, user)
        })
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}