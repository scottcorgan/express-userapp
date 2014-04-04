var UserApp = require('userapp');

module.exports = function (appId) {
  
  // Only initiate once
  if (!UserApp.global.appId) UserApp.initialize({appId: appId});
  
  return function (req, res, next) {
    if (!req.cookies || !req.cookies.ua_session_token) return res.send(400);
    
    UserApp.setToken(req.cookies.ua_session_token);
    UserApp.User.get({user_id: 'self'}, function (err, users) {
      if (err && err.name === 'INVALID_CREDENTIALS') return res.send(401, err.message);
      if (err) return res.send(400, err.message || '');
      
      req.userapp = {
        user: users[0]
      };
      
      next();
    });
  }
};