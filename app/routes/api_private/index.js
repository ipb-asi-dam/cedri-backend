const router = require('express').Router()
const { isAdmin } = require('../../middleweres')

router.use('/users', require('./admin/user'))
router.use('/publications', require('./investigator/publication'))
router.use('/patents', require('./investigator/patent'))
router.use('/software', require('./investigator/software'))
router.use('/theses', require('./investigator/these'))
router.use('/awards', require('./investigator/award'))
router.use('/projects', require('./investigator/project'))
router.use('/statistics', require('./statistic'))

router.use(isAdmin)
router.use('/news', require('./admin/communication/news'))
router.use('/events', require('./admin/communication/event'))
router.use('/medias', require('./admin/communication/media'))
module.exports = router
