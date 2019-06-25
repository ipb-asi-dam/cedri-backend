const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../models')
const { project: Project, file: File } = models

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('description')
    .exists()
    .withMessage('Campo description não pode ser nulo')
    .toString()
    .trim(),
  check('fundedBy')
    .exists()
    .withMessage('Campo fundedBy não pode ser nulo')
    .toString()
    .trim(),
  check('startDate')
    .exists()
    .withMessage('Campo startDate não pode ser nulo')
    .isISO8601()
    .withMessage('Valor de startDate errado. Valores aceitos (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('endDate')
    .exists()
    .withMessage('Campo endDate não pode ser nulo')
    .isISO8601()
    .withMessage('Valor de endDate errado. Valores aceitos (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('type')
    .exists()
    .withMessage('Campo type não pode ser nulo')
    .matches(/^international$|^national$|^other$/)
    .withMessage('parâmetro type precisa ser (international ou national ou other)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }

  const project = req.body
  if (req.user.isAdmin !== true && (project.isAccepted === true || project.isAccepted === 'true')) {
    return res
      .status(401)
      .jsend
      .fail({ message: 'Sem autorização para realizar essa ação' })
  }
  try {
    const image = (req.files || {}).image
    const projectCreated = await models.sequelize.transaction(async (transaction) => {
      if (image) {
        const file = await File.create(image, { transaction })
        project.fileId = file.id
      }
      return Project.create(project, { transaction })
    })
    return res
      .status(201)
      .jsend
      .success(await Project.scope('posts').findByPk(projectCreated.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir Projeto' })
  }
})

module.exports = router
