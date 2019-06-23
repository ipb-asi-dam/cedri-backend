const router = require('express').Router()

router.use(require('./create'))
router.use(require('./edit'))
router.use(require('./show'))
router.use(require('./delete'))

module.exports = router
