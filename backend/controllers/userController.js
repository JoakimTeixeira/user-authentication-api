const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const addUser = async (req, res, next) => {
  try {
    const { name, email, telephone, cpf, password, passwordCheck } = req.body

    // Validate fields
    if (!name || !email || !telephone || !cpf || !password || !passwordCheck) {
      return res.status(400).json({ msg: 'A field was not entered' })
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
      return res.status(400).json({ msg: 'The password must be the same' })
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
      telephone,
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
      res.status(400).json({ msg: 'A field was not entered' })
    }

    // Verify if email exists
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({ msg: 'This email is not registered' })
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' })

    // Create web token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    // Respond with new user
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
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

    const deletedUser = await User.findByIdAndDelete(id)

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

    const newUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: updates
      }, { new: true })

    if (!newUser) {
      return res.status(400).json({ msg: 'This user was not found' })
    }

    res.json(newUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  addUser,
  loginUser,
  getUser,
  deleteUser,
  updateUser
}
