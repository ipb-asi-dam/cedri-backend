const router = require('express').Router()
const { project: Project } = require('../../../../../models')
const { pagination } = require('../../../../../middleweres')

router.get('/', pagination, async (req, res) => {
  try {
    const limit = req.query.limit
    const page = req.query.page
    const offset = limit * (page - 1)
    let projects
    if (req.user.isAdmin !== true) {
      projects = await Project.scope('posts').findAndCountAll({
        limit,
        offset,
        where: {
          investigatorId: +req.user.id
        }
      })
    } else {
      projects = await Project.scope('posts').findAndCountAll({
        limit,
        offset
      })
    }
    const pagesTotal = Math.ceil(projects.count / limit)
    const countTotal = projects.count
    return res
      .status(200)
      .jsend
      .success({ elements: projects.rows, pagesTotal, countTotal })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os projetos' })
  }
})
module.exports = router
