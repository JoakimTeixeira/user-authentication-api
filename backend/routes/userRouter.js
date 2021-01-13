const router = require('express').Router()
const { addUser, loginUser, getUser, deleteUser } = require('../controllers/userController')
const auth = require('../middleware/auth')

//  Register user endpoint
router.get('/:id', auth, getUser)
router.delete('/:id', auth, deleteUser)
router.post('/register', addUser)
router.post('/login', loginUser)

module.exports = router
