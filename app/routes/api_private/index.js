const router = require('express').Router()
const { isAdmin } = require('../../middleweres')

router.use('/users', require('./admin/user'))
router.use('/publications', require('./investigator/publication'))
router.use('/patents', require('./investigator/patent'))
router.use(isAdmin)
router.use('/communications', require('./admin/communication'))
module.exports = router
