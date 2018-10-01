const buildUrl = require('build-url');
const querystring = require('querystring');
const urls = require('./urls');
const path = require('path');

// app/routes.js
module.exports = (app, passport) => {

  // Homepage
  app.get(urls.homepage, (req, res) => {
      res.sendFile(path.join(__dirname, '../static/index.html'));
  });

  // Process the login form
  app.post(urls.login,
    isLoggedIn,
    (req, res, next) => {
      passport.authenticate('local-login', {
        failureFlash : true // allow flash messages
      }, (err, user) => {
        if (err) { return next(err); }
        // Redirect back to the login url if auth fails
        if (!user) { return res.redirect(req.originalUrl); }
        if (req.body.remember) {
         req.session.cookie.maxAge = 24 * 60 * 60; // 24 hours
        } else {
         req.session.cookie.expires = false;
        }
        req.logIn(user, err => {
          if (err) {
            return next(err);
          }
          // If the query string has a redirectUrl, else go to dashboard
          res.redirect(req.query.redirectUrl || urls.dashboard);
        });
      })(req, res, next);
  });

  // // Signup form
  // app.get(urls.signup, (req, res) => {
  //   // render the page and pass in any flash data if it exists
  //   res.render('signup.ejs', { message: req.flash('signupMessage') });
  // });
  //
  // // Submission of signup form
  // app.post(urls.signup,
  //   passport.authenticate('local-signup', {
  //     failureRedirect : urls.signup, // redirect back to the signup page if there is an error
  //     failureFlash : true // allow flash messages
  //   }), (req, res) => {
  //     // If the query string has a redirectUrl, else go to dashboard
  //     res.redirect(req.query.redirectUrl || urls.dashboard);
  //   }
  // );

  // Logout
  app.get(urls.logout, (req, res) => {
    req.logout();
    res.redirect(urls.homepage);
  });
  
  // 404 Since no other routes have been hit
  app.use((req, res) => {
    res.status(404);

    // Respond with html page
    if (req.accepts('html')) {
      res.send('404: Not Found');
      return;
    }

    // Respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // Default to plain-text. send()
    res.type('txt').send('Not found');
  });
};

// Check if the user is logged in
function isLoggedIn(req, res, next) {
  const isAuthenticated = req.isAuthenticated();

  // if user is authenticated in the session or this is the login page
  if (isAuthenticated || req.route.path === urls.login) {
    return next();
  }

  const redirectUrl = buildUrl({
    path: urls.login,
    queryParams: {
      redirectUrl: querystring.escape(req.originalUrl)
    }
  });

  res.redirect(redirectUrl);
}
