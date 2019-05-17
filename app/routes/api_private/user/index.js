const router = require('express').Router();
const models = require('app/models');
const Investigator = models.investigator,
    User = models.user,
    Occupation = models.occupation;

router.post('/', async (req, res) => {
    const user  = req.body;


    await models.sequelize.transaction(async (transaction) => {
        const occupation = await Occupation.findByPk(user.occupationId, {transaction});
        const user = await User.create({email: user.email, password: user.password}, {transaction});
        const Investigator = await Investigador.create({
            name: user.name,
            bio: user.bio,
            isAdmin: user.isAdmin,
            occupation: occupation.id
        }, {transaction});
    })
})
module.exports = router;