const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token')

    // Validates token
    if (!token) {
      return res
        .status(401)
        .json({ msg: 'No authentication token, authorization denied' })
    }

    const isVerified = jwt.verify(token, process.env.JWT_SECRET)

    if (!isVerified) {
      return res
        .status(401)
        .json({ msg: 'Token verification failed, authorization denied' })
    }

    next()
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

module.exports = auth
