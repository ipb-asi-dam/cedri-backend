const router = require('express').Router()

router.use('/authenticate', require('./authenticate'))
router.use('/recovery', require('./recovery'))
router.use('/images', require('./images'))

module.exports = router
