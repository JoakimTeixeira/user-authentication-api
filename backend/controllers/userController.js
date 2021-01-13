const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

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

module.exports = addUser
