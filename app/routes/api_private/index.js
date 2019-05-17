const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/occupations', require('./user/occupation.js'));
module.exports = router;