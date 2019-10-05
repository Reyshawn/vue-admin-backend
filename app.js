const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const app = express()

const multer  = require('multer')

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

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// multer

const storage = multer.memoryStorage()

const upload = multer({ storage: storage })
app.use(upload.single('avatar'))

// Routes
app.get('/', (req, res, next) => {
  res.send('Hello expre!')
})
// test JWT authentication 
app.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.body)
})

app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`)
})