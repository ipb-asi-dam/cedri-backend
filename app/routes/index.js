const router = require('express').Router();

router.use('/api/public', require('./api_public'));
router.use('/api/private', require('./api_private'));

module.exports = router;
