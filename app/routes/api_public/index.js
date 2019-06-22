const router = require('express').Router()

router.use('/authenticate', require('./authenticate'))
router.use('/recover', require('./recover'))
router.use('/images', require('./images'))
router.use('/statistics', require('./statistic'))

module.exports = router
