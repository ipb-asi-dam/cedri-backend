const router = require('express').Router();
const {isAdmin} = require('../../middleweres');

router.use('/users', require('./admin/user'));
router.use(isAdmin);
router.use('/occupations', require('./admin/user/occupation.js'));
router.use('/communications', require('./admin/communication'));
router.use('/communications/medias', require('./admin/communication/media.js'));
router.use('/communications/events', require('./admin/communication/event.js'));
router.use('/communications/news', require('./admin/communication/news.js'));
module.exports = router;