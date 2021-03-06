const router = require('express').Router()
const { addUser, loginUser, getUser, deleteUser, updateUser, verifyToken, getToken } = require('../controllers/userController')
const auth = require('../middleware/auth')

//  Register user endpoint
router.post('/register', addUser)
router.post('/login', loginUser)
router.get('/auth/:token', getToken)
router.get('/:id', auth, getUser)
router.delete('/:id', auth, deleteUser)
router.put('/:id', auth, updateUser)

module.exports = router
