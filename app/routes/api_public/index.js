const router = require('express').Router()

router.use('/authenticate', require('./authenticate'))
router.use('/recovery', require('./recovery'))
router.use('/images', require('./images'))
router.use('/statistics', require('./statistic'))

module.exports = router
