import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const signup = async(req, res) => {
  const {fullName, email, password} = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({message: 'Required fields are not provided'})
    }

    if (password.length < 6) {
      return res.status(400).json({message: 'Password must have 6 characters'})
    } 

    const user = await User.findOne({email})
    if (user) {
      return res.status(400).json({message: 'Unable to use this email'})
    }

    const salt = await bcrypt.genSalt(15)
    const hash = await bcrypt.hash(password, salt)
    const newUser = new User ({
      fullName,
      email,
      password: hash
    })

    if (newUser) {
      // create a profile pic, just like gmail, which is the first letter
      generateToken(newUser._id, res)
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      })
      console.log(`new user created ${newUser}`)
    } else {
      res.status(400).json({message: 'Failed to signup'})

    }
  } catch (err) {
    console.log(`error in signup ${err.messag}`)
    res.status(500).json({message: 'Internal Server Error'})
  }
}

export const login = async(req, res) => {
  const {email, password} = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({message: 'Required fields are not provided'})
    }
    const user = await User.findOne({email})
    if (!user) {
      return res.status(400).json({message: 'Invalid credentials'})
    }
    const check = await bcrypt.compare(password, user.password)
    if (!check) {
      return res.status(400).json({message: 'Invalid credentials'})
    }
    const prevToken = req.cookies.jwt;
    if (prevToken) {
      try {
        jwt.verify(prevToken, process.env.JWT_SECRET);
        res.cookie('jwt', '', {
          httpOnly: true,
          expires: new Date(0),
          sameSite: 'Strict',
          secure: process.env.NODE_ENV !== 'dev',
        });
      } catch (err) {
      }
    }
    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
    console.log(`Login by ${user}`)
  } catch (err) {
    console.log(`error in login ${err.messag}`)
    res.status(500).json({message: 'Internal Server Error'})
  }
}

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', {maxAge: 0})
    res.status(200).json({message: 'Logged out successfully'})
  } catch (err) {
    console.log(`error in logout ${err.messag}`)
    res.status(500).json({message: 'Internal Server Error'})
  }
}

export const updateProfile = async(req, res) => {
  try {
    const {profilePic} = req.body
    const userId = req.user._id
    if (!profilePic) {
      return res.status(400).json({message: 'No profile pic provided'})
    }
    const response = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: response.secure_url}, {new: true})
    res.status(200).json(updatedUser)
  } catch (err) {
    console.log(`error in updateProfile ${err.messag}`)
    res.status(500).json({message: 'Internal Server Error'})
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (err) {
    console.log(`error in checkAuth ${err.messag}`)
    res.status(500).json({message: 'Internal Server Error'})
  }
}