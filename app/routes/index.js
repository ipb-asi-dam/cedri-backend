const router = require('express').Router();

router.use('/public', require('./api_public'));
router.use('/private', require('./api_private'));

module.exports = router;
