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
router.use('/medias', require('./admin/communication/media.js'))
router.use('/events', require('./admin/communication/event.js'))
router.use('/news', require('./admin/communication/news.js'))
module.exports = router
