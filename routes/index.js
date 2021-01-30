var express = require('express');
var router = express.Router();
const passport = require('passport');
const { route } = require('./habits');

/* GET home page. */
router.get('/', function(req, res, next) {
  req.logout();
  res.redirect('/users');
});

router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/users',
    failureRedirect : '/users'
  }
));

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/users');
});

router.get('/debug', function(req, res){
  let debugInfo = ""
  debugInfo += "current server time:" + new Date()
  res.send(debugInfo)
});

module.exports = router;
