const router = require('express').Router()
const model = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')
const { award: Award } = model
const { check, validationResult } = require('express-validator/check')

router.put('/:id', [
  check('date')
    .optional()
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado (YYYY ou YYYY-MM ou YYYY-MM-DD)')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const id = +req.params.id
  const award = req.body
  try {
    const _award = await Award.findByPk(id)
    if (!_award) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Prêmio com id ' + id + ' não encontrado.' })
    }
    if (!hasPermissionPosts(req.user, _award.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }

    await Award.update(award, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await Award.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao realizer upgrade no prêmio com id ' + id })
  }
})

module.exports = router
