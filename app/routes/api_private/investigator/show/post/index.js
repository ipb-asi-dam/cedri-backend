const router = require('express').Router()
const models = require('../../../../../models')
const { patent, software, project, award, publication, these, investigator } = models
const modelos = [patent, software, project, award, publication, these]
router.get('/', async (req, res) => {
  const selects = await Promise.all(modelos.map((model) => {
    return model.findAll({
      attributes: ['id',
        'title',
        [models.Sequelize.col('investigator.name'), 'author'],
        [models.Sequelize.literal(`'${model.getTableName()}'`), 'type']
      ],
      include: [{
        model: investigator,
        attributes: []
      }]
    })
  }))
  const posts = selects.reduce((acumulado, atual) => [...acumulado, ...atual], [])
  return res
    .status(200)
    .jsend
    .success(posts)
})
module.exports = router
