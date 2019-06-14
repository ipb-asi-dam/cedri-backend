const router = require('express').Router()
const { isAdmin } = require('../../middleweres')

router.use('/users', require('./admin/user'))
router.use('/publications', require('./investigator/publication'))
router.use(isAdmin)
router.use('/communications', require('./admin/communication'))
router.use('/medias', require('./admin/communication/media.js'))
router.use('/events', require('./admin/communication/event.js'))
router.use('/news', require('./admin/communication/news.js'))
module.exports = router
