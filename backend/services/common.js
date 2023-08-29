const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // token =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTdkMDczYTFkOGY4ZGE5MTE1NDYzNiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzMTY2ODQ3fQ.5SYX-Eyo3PvuPeg1FsLqcaqeEAx7ID1kA7CsCj865i8";
  return token;
};
