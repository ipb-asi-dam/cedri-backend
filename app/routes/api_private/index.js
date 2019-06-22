const router = require('express').Router()
const { isAdmin } = require('../../middleweres')

router.use('/users', require('./admin/user'))
router.use('/publications', require('./investigator/publication'))
router.use('/patents', require('./investigator/patent'))
router.use('/software', require('./investigator/software'))
router.use('/theses', require('./investigator/these'))
router.use('/awards', require('./investigator/award'))

router.use(isAdmin)
router.use('/communications', require('./admin/communication'))
module.exports = router
