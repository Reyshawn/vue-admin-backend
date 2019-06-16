const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const app = express()

// Passport config
require('./config/passport')(passport)

// DB config
const db = require('./config/keys').MongoURI

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err))

// Bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
  res.send('Hello expre!')
})

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api', require('./routes/index'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`)
})