const jwt = require('jsonwebtoken');

async function requireAuth(req, res, next) {
  const decoded = jwt.verify(req.body.token.token,process.env.SECRET_JWT)
  req.userData = decoded
  next()
}

module.exports = {
  requireAuth
}
