const router = require('express').Router()
const models = require('../../../models')
const { publication: Publication, these: These, award: Award, patent: Patent, software: Software,
  project: Project } = models

router.get('/outcomes', async (req, res, next) => {
  try {
    const publications = (await Publication.findAndCountAll()).count
    const theses = (await These.findAndCountAll()).count
    const awards = (await Award.findAndCountAll()).count
    const patents = (await Patent.findAndCountAll()).count
    const softwares = (await Software.findAndCountAll()).count
    const intelectualProp = patents + softwares
    return res
      .status(200)
      .jsend
      .success({
        publications,
        theses,
        awards,
        intellectual_properties: intelectualProp,
        total: publications + theses + awards + intelectualProp
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar o total de Outcomes do CeDRI.' })
  }
})

router.get('/awards', async (req, res, next) => {
  try {
    const awards = (await Award.findAndCountAll()).count
    return res
      .status(200)
      .jsend
      .success({
        awards,
        total: awards
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar o total de Premiações do CeDRI.' })
  }
})

router.get('/intellectual_properties', async (req, res, next) => {
  try {
    const patents = (await Patent.findAndCountAll()).count
    const softwares = (await Software.findAndCountAll()).count
    return res
      .status(200)
      .jsend
      .success({
        patents,
        softwares,
        total: patents + softwares
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar o total de Propriedades Intelectuais do CeDRI.' })
  }
})

router.get('/projects', async (req, res, next) => {
  try {
    const international = (await Project.findAndCountAll(
      {
        where: {
          type: 'international'
        }
      })).count

    const national = (await Project.findAndCountAll(
      {
        where: {
          type: 'national'
        }
      })).count

    const other = (await Project.findAndCountAll(
      {
        where: {
          type: 'other'
        }
      })).count
    return res
      .status(200)
      .jsend
      .success({
        international,
        national,
        other,
        total: international + national + other
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar o total de Projetos do CeDRI.' })
  }
})

router.get('/publications', async (req, res, next) => {
  try {
    const books = (await Publication.findAndCountAll(
      {
        where: { type: 'b' }
      })).count

    const bookChapters = (await Publication.findAndCountAll(
      {
        where: { type: 'bc' }
      })).count

    const editorials = (await Publication.findAndCountAll(
      {
        where: { type: 'ed' }
      })).count

    const journals = (await Publication.findAndCountAll(
      {
        where: { type: 'j' }
      })).count

    const proceedings = (await Publication.findAndCountAll(
      {
        where: { type: 'p' }
      })).count

    return res
      .status(200)
      .jsend
      .success({
        books,
        bookChapters,
        editorials,
        proceedings,
        journals,
        total: books + bookChapters + editorials + proceedings + journals
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar o total de Publicações do CeDRI.' })
  }
})

router.get('/theses', async (req, res, next) => {
  try {
    const mscs = (await These.findAndCountAll(
      {
        where: {
          type: 'msc'
        }
      })).count

    const phds = (await These.findAndCountAll(
      {
        where: {
          type: 'phd'
        }
      })).count

    return res
      .status(200)
      .jsend
      .success({
        mscs,
        phds,
        total: mscs + phds
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar o total de Teses do CeDRI.' })
  }
})

module.exports = router
