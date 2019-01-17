require('module-alias/register') // module aliases
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 3001
const passport = require('passport')
const flash = require('connect-flash')
const secrets = require('./config/secrets')
const path = require('path')
const favicon = require('serve-favicon')
const config = require('./config/config')

require('./app/passport/passport')(passport) // pass passport for configuration

// set up our express application
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// expose all the static file folders, with cache as defined in the config
app.use('/', express.static(path.join(__dirname, 'static'), { maxAge: config['cache-control'] || 0, dotfiles: 'allow' }))

app.use(favicon(path.join(__dirname, 'favicon.ico')))

// required for passport
app.use(session({
  secret: secrets.sessionSecret,
  resave: true,
  saveUninitialized: true
})) // session secret
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Routes
require('./app/routes.js')(app, passport) // load our routes and pass in our app and fully configured passport

// Custom csrf error handling
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err, req, res)
  res.status(403)
  res.send('Forbidden')
})

app.listen(port)
console.log('App listening on port ' + port)
