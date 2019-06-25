const router = require('express').Router()
const models = require('../../../../../models')
const { check, validationResult } = require('express-validator/check')
const Publication = models.publication
const { hasPermissionPosts } = require('../../../../../middleweres')

router.put('/:id', [
  check('date')
    .optional()
    .isISO8601()
    .withMessage('Formato date errado. Valor esperado YYYY'),
  check('type')
    .optional()
    .toString()
    .matches('^b$|^bc$|^j$|^p$|^e$')
    .withMessage('parâmetro type precisa ser (j ou b ou bc ou p ou e)')
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .jsend
      .fail({ errors: errors.array() })
  }
  const id = +req.params.id
  try {
    const publication = await Publication.findByPk(id)
    if (!publication) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Publication não encontrada!' })
    }
    if (!hasPermissionPosts(req.user, publication.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para editar esse post' })
    }
    await Publication.update(req.body,
      {
        where: {
          id
        }
      })

    return res
      .status(200)
      .jsend
      .success(await Publication.scope('posts').findByPk(publication.id))
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Algo deu errado durante o update da publicação com id ' + id })
  }
})

module.exports = router
