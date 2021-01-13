const router = require('express').Router()
const addUser = require('../controllers/userController')

//  Register user endpoint
router.post('/register', addUser)

module.exports = router
