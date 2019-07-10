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
    const [isAnnualStatistics, msg, start, end] = checkYears(req.query.startYear, req.query.endYear)
    const investigatorId = +req.user.id
    let awards
    if (!showMy) {
      if (isAnnualStatistics) {
        const annualStatistics = await createAnnualStatistcs(start, end, Award)
        return res.status(200).jsend.success( [...annualStatistics] )
      }
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
    const [isAnnualStatistics, msg, start, end] = checkYears(req.query.startYear, req.query.endYear)
    const investigatorId = +req.user.id
    let international, national, other
    if (!showMy) {
      if (isAnnualStatistics) {
        const annualStatistics = await createAnnualStatistcs(start, end, Project)
        return res.status(200).jsend.success( [...annualStatistics] )
      }
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
    const [isAnnualStatistics, msg, start, end] = checkYears(req.query.startYear, req.query.endYear)
    const investigatorId = +req.user.id
    let books, bookChapters, editorials, proceedings, journals
    if (!showMy) {
      if (isAnnualStatistics) {
        const annualStatistics = await createAnnualStatistcs(start, end, Publication)
        return res.status(200).jsend.success( [...annualStatistics] )
      }
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
    const [isAnnualStatistics, msg, start, end] = checkYears(req.query.startYear, req.query.endYear)
    const investigatorId = +req.user.id
    let mscs, phds
    if (!showMy) {
      if (isAnnualStatistics) {
        const annualStatistics = await createAnnualStatistcs(start, end, These)
        return res.status(200).jsend.success( [...annualStatistics] )
      }
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

function checkYears(_start, _end) {
  let start = +_start
  let end = +_end
  if (start == null || end == null) {
    return [false, `Nulo`, -1, -1]
  }
  if (start < 0) {
    return [false, `Ano de início (${start} inválido. Deve ser positivo.`, -1, -1]
  }
  if (end < 0) {
    return [false, `Ano de término (${start} inválido. Deve ser positivo.`, -1, -1]
  }
  if (start > end) {
    return [false, `Ano de início (${end}) maior que ano de término (${start}).`,-1, -1]
  }
  if (!Number.isInteger(start)) {
    return [false, `Ano de início (${start}) inválido. Deve ser um número.`,-1, -1]
  }
  if (!Number.isInteger(end)) {
    return [false, `Ano de término (${end}) inválido. Deve ser um número.`,-1, -1]
  }
  return [true, `ok`, start, end]
}

async function createAnnualStatistcs(start, end, Model) {
  let annualStatistics = []
  for (let current = start; current <= end; current++) {
    let statistic
    if (Model.name === 'project') {
      statistic = (await Model.findAndCountAll({
        attributes: [models.sequelize.fn('YEAR', models.sequelize.col('startDate'))],
        where: models.sequelize.where(models.sequelize.fn('YEAR', models.sequelize.col('startDate')), current)
      })).count
    } else {
      statistic = (await Model.findAndCountAll({
        attributes: [models.sequelize.fn('YEAR', models.sequelize.col('date'))],
        where: models.sequelize.where(models.sequelize.fn('YEAR', models.sequelize.col('date')), current)
      })).count
    }
    annualStatistics.push({
      year: current,
      qty: statistic
    })
  }
  return annualStatistics
}

module.exports = router
