const localStrategy = require('passport-local').Strategy;
const mysql = require('mysql2');
const named = require('yesql').mysql;
const argon2 = require('argon2');
const dbconfig = require('../../config/database');

const connection = mysql.createConnection(dbconfig.connection);

module.exports = function(passport) {
  // Passport needs ability to serialize and unserialize users out of session

  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  // Used to deserialize the user
  passport.deserializeUser((userId, done) => {
    connection.query(named("SELECT * FROM users WHERE user_id = :userId")({userId: userId}), function(err, rows){
      done(err, rows[0]);
    });
  });

  // Signup
  passport.use(
    'local-signup',
    new localStrategy({passReqToCallback: true}, (req, username, password, done) => {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      connection.query(named("SELECT * FROM users WHERE username = :username")({username: username}), function(err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          // Create the user
          argon2.hash(password).then(password_hash => {          
            const newUserMysql = {
              username: username,
              password_hash: password_hash
            };

            const insertQuery = "INSERT INTO users (username, password_hash) values (:username, :password_hash)";
            connection.query(named(insertQuery)(newUserMysql),function(err, rows) {
              if (err)
                return done(err);
              newUserMysql.user_id = rows.insertId;

              return done(null, newUserMysql);
            });
          }).catch(err => {
            return done(err);
          });
        }
      });
    })
  );

  // Login
  passport.use(
    'local-login',
    new localStrategy({passReqToCallback: true}, (req, username, password, done) => {
      connection.query(named("SELECT * FROM users WHERE username = :username")({username: username}), function(err, rows){
        if (err)
          return done(err);
        if (!rows.length) {
          return done(null, false);
        }
        
        argon2.verify(rows[0].password_hash, password).then(match => {
          if (match) {
            return done(null, rows[0]);
          } else {
            return done(null, false);
          }
        }).catch(err => {
          return done(err);
        });
      });
    })
  );
};
