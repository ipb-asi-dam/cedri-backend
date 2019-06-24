const router = require('express').Router()
const { these: These } = require('../../../../../models')
const { hasPermissionPosts } = require('../../../../../middleweres')
const { check, validationResult } = require('express-validator/check')

router.put('/:id', [
  check('type')
    .optional()
    .toString()
    .matches('^phd$|^msc$')
    .withMessage('parâmetro type precisa ser (phd ou msc)'),
  check('date')
    .optional()
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado (YYYY ou YYYY-MM ou YYYY-MM-DD')

], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }

  const id = +req.params.id
  const these = req.body
  try {
    const _these = await These.findByPk(id)
    if (!_these) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'These com id ' + id + 'não encontrada' })
    }
    if (!hasPermissionPosts(req.user, _these.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await These.update(these, {
      where: {
        id
      }
    })
    return res
      .status(200)
      .jsend
      .success(await These.scope('posts').findByPk(id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao editar these com id ' + id })
  }
})

module.exports = router
