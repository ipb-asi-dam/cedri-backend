const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const models = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')
const { project: Project, file: File } = models

router.put('/:id', [
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valor de startDate errado. Valores aceitos (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valor de endDate errado. Valores aceitos (YYYY-MM-DD ou YYYY-MM ou YYYY)'),
  check('type')
    .optional()
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
  const id = +req.params.id

  try {
    const _project = await Project.findByPk(id)
    const image = (req.files || {}).image
    if (!_project) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Projeto com id ' + id + ' não encontrado' })
    }
    if ((!hasPermissionPosts(req.user, _project.investigatorId)) || (req.user.isAdmin !== true && (project.isAccepted === true || project.isAccepted === 'true'))) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await models.sequelize.transaction(async (transaction) => {
      if (image) {
        if (_project.fileId) {
          await File.update(image, {
            transaction,
            where: {
              id: _project.fileId
            }
          })
        } else {
          const file = await File.create(image, { transaction })
          project.fileId = file.id
        }
      }
      return Project.update(project, {
        where: {
          id
        },
        transaction
      })
    })
    return res
      .status(200)
      .jsend
      .success(await Project.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao atualizar projeto com id ' + id })
  }
})

module.exports = router
