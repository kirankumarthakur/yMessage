import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const authorised = async(req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({message: 'Unauthorised - no token provided'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res.status(401).json({message: 'Unauthorised - invalid token'})
    }
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(404).json({message: 'User not found'})
    }
    req.user = user
    next()
  } catch (err) {
    console.log(`error in authoried ${err.message}`)
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorised - token expired' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorised - malformed token' });
    }

    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}