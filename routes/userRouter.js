const router = require('express').Router()
const { addUser, loginUser, getUser, deleteUser, updateUser, verifyToken } = require('../controllers/userController')
const auth = require('../middleware/auth')

//  Register user endpoint
router.post('/register', addUser)
router.post('/login', loginUser)
router.post('/isTokenValid', verifyToken)
router.get('/:id', auth, getUser)
router.delete('/:id', auth, deleteUser)
router.patch('/:id', auth, updateUser)

module.exports = router
