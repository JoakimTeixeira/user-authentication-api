const router = require('express').Router()
const { addUser, loginUser } = require('../controllers/userController')

//  Register user endpoint
router.post('/register', addUser)
router.post('/login', loginUser)

module.exports = router
