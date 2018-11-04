const buildUrl = require('build-url');
const querystring = require('querystring');
const urls = require('./urls');
const path = require('path');
const csrf = require('csurf');

const weddingInvites = require('./wedding-invites/wedding-invites');

const csrfProtection = csrf({ cookie: true });

// app/routes.js
module.exports = (app, passport) => {

  // Login page
  app.get(urls.login, (req, res) => {
    // If the user is already authenticated, redirect to redirect url or invites
    if (req.isAuthenticated()) {
      res.redirect(querystring.escape(req.query.redirectUrl) || urls.invites);
    }

    res.sendFile(path.join(__dirname, '../static/login.html'));
  });

  app.get('/csrf', csrfProtection, (req, res) => {
    res.send({ csrf: req.csrfToken() });
  });

  // Process the login form
  app.post(urls.login,
    csrfProtection,
    isLoggedIn,
    (req, res, next) => {
      passport.authenticate('local-login', (err, user) => {
        if (err) { return next(err); }
        // Send error message on login failure
        if (!user) { return res.send({errorMessage: "Your username or password are incorrect"}); }
        if (req.body.remember) {
         req.session.cookie.maxAge = 24 * 60 * 60; // 24 hours
        } else {
         req.session.cookie.expires = false;
        }
        req.logIn(user, err => {
          if (err) { return next(err); }
          // If the query string has a redirectUrl, else go to invites
          res.send({redirectUrl: querystring.unescape(req.query.redirectUrl) || urls.invites});
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

  app.post(urls.findInvite,
    csrfProtection,
    (req, res) => {
      const inviteFormData = req.body;
      if (!inviteFormData.firstName || !inviteFormData.lastName) {
        return res.status(404).send({ error: 'Not found' });
      }
      weddingInvites.findInvite(inviteFormData).then(guestData => {
        res.send({success: true, guestData: guestData});
      });
    });

  app.post(urls.submitInvite,
    (req, res) => {
      const guestData = req.body;
      if (!guestData.invite || !guestData.guests || !guestData.guests.length === 0) {
        return res.status(404).send({ error: 'Not found' });
      }
      weddingInvites.submitInvite(guestData).then(result => {
        if (!result) {
          return res.status(404).send({ error: 'Not found' });
        }
        res.send({success: result});
      });
    });

  app.get(urls.invites,
    isLoggedIn,
    (req, res) => {
      res.sendFile(path.join(__dirname, '../static/invites.html'));
    });

  app.post(urls.invites,
    isLoggedIn,
    (req, res) => {
      weddingInvites.getAllInvitesWithGuests().then(invitesWithGuests => {
        return res.send({ success: true, invitesWithGuests: invitesWithGuests});
      })
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
