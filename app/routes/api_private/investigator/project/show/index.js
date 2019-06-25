const router = require('express').Router()
const { project: Project } = require('../../../../../models')
const { pagination, hasPermissionPosts } = require('../../../../../middleweres')
const getPages = require('../../../../../config/global_modules/getPosts')

router.get('/', pagination, async (req, res) => {
  try {
    const paginationResult = await getPages(req, Project)
    return res
      .status(200)
      .jsend
      .success(paginationResult)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todos os projetos' })
  }
})

router.get('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const project = await Project.scope('complete').findByPk(id)
    if (!project) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Projeto com id ' + id + ' não encontrado' })
    }
    if (!hasPermissionPosts(req.user, project.investigatorId)) {
      return res
        .status(401)
        .jsend
        .fail({ message: 'Sem permissão para realizar get neste post' })
    }
    return res
      .status(200)
      .jsend
      .success(project)
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar Projeto de id ' + id })
  }
})
module.exports = router
