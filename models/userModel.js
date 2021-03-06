const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  cpf: { type: String, required: true, minlength: 11, maxlength: 11, unique: true },
  password: { type: String, required: true, minlength: 8 }
})

// Export model with collection and schema
const User = mongoose.model('user', userSchema)
module.exports = User
