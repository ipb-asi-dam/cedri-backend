const router = require('express').Router()

router.use('/authenticate', require('./authenticate'))
router.use('/recover', require('./recover'))
router.use('/images', require('./images'))
router.use('/statistics', require('./statistic'))
router.use('/projects', require('./show/project'))
router.use('/posts', require('./show/post'))

module.exports = router
