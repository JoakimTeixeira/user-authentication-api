const router = require('express').Router()
const { addUser, loginUser, getUser } = require('../controllers/userController')
const auth = require('../middleware/auth')

//  Register user endpoint
router.get('/:id', auth, getUser)
router.post('/register', addUser)
router.post('/login', loginUser)

module.exports = router
