const LocalStrategy = require('passport-local').Strategy
const named = require('yesql').mysql
const argon2 = require('argon2')
const pool = require('../database')

module.exports = function (passport) {
  // Passport needs ability to serialize and unserialize users out of session

  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  })

  // Used to deserialize the user
  passport.deserializeUser((userId, done) => {
    pool.query(named('SELECT * FROM users WHERE user_id = :userId')({ userId: userId }), function (err, rows) {
      done(err, rows[0])
    })
  })

  // Signup
  passport.use(
    'local-signup',
    new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      pool.query(named('SELECT * FROM users WHERE username = :username')({ username: username }), function (err, rows) {
        if (err) { return done(err) }
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'))
        } else {
          // Create the user
          argon2.hash(password).then(passwordHash => {
            const newUserMysql = {
              username: username,
              password_hash: passwordHash
            }

            const insertQuery = 'INSERT INTO users (username, password_hash) values (:username, :password_hash)'
            pool.query.query(named(insertQuery)(newUserMysql), function (err, rows) {
              if (err) { return done(err) }
              newUserMysql.user_id = rows.insertId

              return done(null, newUserMysql)
            })
          }).catch(err => {
            return done(err)
          })
        }
      })
    })
  )

  // Login
  passport.use(
    'local-login',
    new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
      pool.query(named('SELECT * FROM users WHERE username = :username')({ username: username }), function (err, rows) {
        if (err) { return done(err) }
        if (!rows.length) {
          return done(null, false)
        }

        argon2.verify(rows[0].password_hash, password).then(match => {
          if (match) {
            return done(null, rows[0])
          } else {
            return done(null, false)
          }
        }).catch(err => {
          return done(err)
        })
      })
    })
  )
}
