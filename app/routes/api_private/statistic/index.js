const router = require('express').Router()
const models = require('../../../models')
const { publication: Publication, these: These, award: Award, patent: Patent, software: Software,
  project: Project } = models

router.get('/outcomes', async (req, res, next) => {
  try {
    const showMy = (req.query.showMy === true || req.query.showMy === 'true')
    const investigatorId = +req.user.id
    let publications, theses, awards, patents, software
    if (!showMy) {
      publications = (await Publication.findAndCountAll()).count
      theses = (await These.findAndCountAll()).count
      awards = (await Award.findAndCountAll()).count
      patents = (await Patent.findAndCountAll()).count
      software = (await Software.findAndCountAll()).count
    } else {
      publications = (await Publication.findAndCountAll({ where: { investigatorId } })).count
      theses = (await These.findAndCountAll({ where: { investigatorId } })).count
      awards = (await Award.findAndCountAll({ where: { investigatorId } })).count
      patents = (await Patent.findAndCountAll({ where: { investigatorId } })).count
      software = (await Software.findAndCountAll({ where: { investigatorId } })).count
    }

    const intelectualProp = patents + software
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
    const showMy = (req.query.showMy === true || req.query.showMy === 'true')
    const investigatorId = +req.user.id
    let awards
    if (!showMy) {
      awards = (await Award.findAndCountAll()).count
    } else {
      awards = (await Award.findAndCountAll({ where: { investigatorId } })).count
    }
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
    const showMy = (req.query.showMy === true || req.query.showMy === 'true')
    const investigatorId = +req.user.id
    let patents, software
    if (!showMy) {
      patents = (await Patent.findAndCountAll()).count
      software = (await Software.findAndCountAll()).count
    } else {
      patents = (await Patent.findAndCountAll({ where: { investigatorId } })).count
      software = (await Software.findAndCountAll({ where: { investigatorId } })).count
    }
    return res
      .status(200)
      .jsend
      .success({
        patents,
        software,
        total: patents + software
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
    const showMy = (req.query.showMy === true || req.query.showMy === 'true')
    const investigatorId = +req.user.id
    let international, national, other
    if (!showMy) {
      international = (await Project.findAndCountAll(
        {
          where: {
            type: 'international'
          }
        })).count
      national = (await Project.findAndCountAll(
        {
          where: {
            type: 'national'
          }
        })).count
      other = (await Project.findAndCountAll(
        {
          where: {
            type: 'other'
          }
        })).count
    } else {
      international = (await Project.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'international'
          }
        })).count
      national = (await Project.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'national'
          }
        })).count
      other = (await Project.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'other'
          }
        })).count
    }
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
    const showMy = (req.query.showMy === true || req.query.showMy === 'true')
    const investigatorId = +req.user.id
    let books, bookChapters, editorials, proceedings, journals
    if (!showMy) {
      books = (await Publication.findAndCountAll(
        {
          where: {
            type: 'b'
          }
        })).count
      bookChapters = (await Publication.findAndCountAll(
        {
          where: {
            type: 'bc'
          }
        })).count
      editorials = (await Publication.findAndCountAll(
        {
          where: {
            type: 'e'
          }
        })).count
      proceedings = (await Publication.findAndCountAll(
        {
          where: {
            type: 'p'
          }
        })).count
      journals = (await Publication.findAndCountAll(
        {
          where: {
            type: 'j'
          }
        })).count
    } else {
      books = (await Publication.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'b'
          }
        })).count
      bookChapters = (await Publication.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'bc'
          }
        })).count
      editorials = (await Publication.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'e'
          }
        })).count
      proceedings = (await Publication.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'p'
          }
        })).count
      journals = (await Publication.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'j'
          }
        })).count
    }

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
    const showMy = (req.query.showMy === true || req.query.showMy === 'true')
    const investigatorId = +req.user.id
    let mscs, phds
    if (!showMy) {
      mscs = (await These.findAndCountAll(
        {
          where: {
            type: 'msc'
          }
        })).count

      phds = (await These.findAndCountAll(
        {
          where: {
            type: 'phd'
          }
        })).count
    } else {
      mscs = (await These.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'msc'
          }
        })).count

      phds = (await These.findAndCountAll(
        {
          where: {
            investigatorId,
            type: 'phd'
          }
        })).count
    }

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
