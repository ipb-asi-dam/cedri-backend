const router = require('express').Router()
const { check, validationResult } = require('express-validator/check')
const { project: Project } = require('../../../../models')
const { hasPermission } = require('../../../../middleweres')

router.post('/', [
  check('title')
    .exists()
    .withMessage('Campo title não pode ser nulo')
    .toString()
    .trim(),
  check('description')
    .exists()
    .withMessage('Campo authors não pode ser nulo')
    .toString()
    .trim(),
  check('fundedBy')
    .exists()
    .withMessage('Campo fundedBy não pode ser nulo'),
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
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou j ou p ou e)')
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
    const projectCreated = await Project.create(project)
    return res
      .status(201)
      .jsend
      .success(projectCreated)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao inserir Patent' })
  }
})

router.put('', [
  hasPermission,
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
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou j ou p ou e)')
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

  if (req.user.isAdmin !== true && (project.isAccepted === true || project.isAccepted === 'true')) {
    return res
      .status(401)
      .jsend
      .fail({ message: 'Sem autorização para realizar essa ação' })
  }
  try {
    const _project = await Project.findByPk(id)
    if (!_project) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Projeto com id ' + id + 'não encontrado' })
    }
    await Project.update(project, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Project.findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao atualizar projeto com id ' + id })
  }
})

module.exports = router
