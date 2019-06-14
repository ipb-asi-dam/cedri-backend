const router = require('express').Router()
const middlewares = require('../middleweres')

router.use('/api/public', require('./api_public'))
router.use(middlewares.isValidToken)
router.use('/api/private', require('./api_private'))

module.exports = router
