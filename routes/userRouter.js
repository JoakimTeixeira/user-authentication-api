const router = require('express').Router()
const { addUser, loginUser, getUser, deleteUser, updateUser } = require('../controllers/userController')
const auth = require('../middleware/auth')

//  Register user endpoint
router.post('/register', addUser)
router.post('/login', loginUser)
router.get('/:id', auth, getUser)
router.delete('/:id', auth, deleteUser)
router.patch('/:id', auth, updateUser)

module.exports = router
