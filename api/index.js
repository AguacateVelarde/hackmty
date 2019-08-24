const { Router } = require('express')
const router = Router()
/*const { loginApi } = require('./auth/login.js')
const refresher = require( './auth/refresher.js')
const { register, verifyUnique } = require('./auth/register.js')

router.post( '/login', loginApi )
router.post( '/token', refresher )
router.post( '/register', verifyUnique, register )*/

router.get( '/online', (req, res) => {
  res.json({ x : 'hi'})
})

module.exports = router;
