const { getUser } = require("../service/auth.js");

function checkForAuthentication(req, res, next) {
  // Check if token exists in cookies
  const tokenCookie = req.cookies?.token;
  if (!tokenCookie) return next();

  const token = tokenCookie;

  // Get user based on token
  const user = getUser(token);
  if (!user) {
    // If user is invalid, skip user assignment and proceed
    return next();
  }

  // Attach user to request
  req.user = user;
  return next();
}

function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.end("unAuthorised");
    return next();
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};
