const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const addUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, cpf, password, passwordCheck } = req.body

    // Validate fields
    if (!name || !email || !phoneNumber || !cpf || !password || !passwordCheck) {
      return res.status(400).json({ msg: 'A field was not entered' })
    }

    if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
      return res.status(400).json({ msg: 'Email format is invalid' })
    }

    if (cpf.length < 11 || cpf.length > 11) {
      return res
        .status(400)
        .json({ msg: 'The cpf must have exactly 11 characters' })
    }

    // Verify password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: 'The password must have at least 8 characters' })
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ msg: 'The same password must be entered twice' })
    }

    // Verify if email exists
    const existingEmail = await User.findOne({ email: email })

    if (existingEmail) {
      return res.status(400).json({ msg: 'This email already exists' })
    }

    // Verify if cpf exists
    const existingCpf = await User.findOne({ cpf: cpf })

    if (existingCpf) {
      return res.status(400).json({ msg: 'This cpf already exists' })
    }

    // Generate salted hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    // Create new user model
    const newUser = new User({
      name,
      email,
      phoneNumber,
      cpf,
      password: passwordHash
    })

    // Save new user to mongo database
    const savedUser = await newUser.save()
    res.json(savedUser)
  } catch (error) {
    // Verify error in the server
    res.status(500).json({ error: error.message })
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'A field was not entered' })
    }

    // Verify if email exists
    const user = await User.findOne({ email: email })

    // Validate password
    const isMatch = user && await bcrypt.compare(password, user.password)

    if (!user || !isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' })
    }

    // Create web token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    // Respond with new user
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        cpf: user.cpf
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params

    // Verify if user exists
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return res.status(400).json({ msg: 'This user does not exists' })
    }

    return res.json(foundUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    // Delete user
    const deletedUser = await User.findByIdAndDelete(id)

    // Verify if user was deleted
    if (!deletedUser) {
      return res.status(400).json({ msg: 'This user does not exists' })
    }

    res.json(deletedUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Update user
    const newUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: updates
      }, { new: true })

    // Verify if user was updated
    if (!newUser) {
      return res.status(400).json({ msg: 'This user was not found' })
    }

    res.json(newUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getToken = async (req, res, next) => {
  try {
    const { token } = req.params

    // Verify token
    if (!token) return res.status(400).json({ msg: 'Token does not exist' })

    // If token string is valid, return user id
    const isVerified = jwt.verify(token, process.env.JWT_SECRET)
    if (!isVerified) return res.status(400).json({ msg: 'Token is invalid' })

    // Verify if user exists
    const foundUser = await User.findById(isVerified.id)

    if (!foundUser) {
      return res.status(400).json({ msg: 'The user was not found' })
    }

    // If token is valid, return token and user id
    return res.json({
      token,
      id: foundUser.id
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  addUser,
  loginUser,
  getUser,
  deleteUser,
  updateUser,
  getToken
}
