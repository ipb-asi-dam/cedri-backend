const router = require('express').Router();
const {isAdmin} = require('../../middleweres');

router.use(isAdmin);
router.use('/users', require('./admin/user'));
router.use('/occupations', require('./admin/user/occupation.js'));
module.exports = router;