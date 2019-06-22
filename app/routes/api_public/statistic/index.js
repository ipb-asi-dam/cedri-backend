const router = require('express').Router()
const models = require('../../../models')
const { publication: Publication, these: These, award: Award, patent: Patent, software: Software } = models

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
        publications: publications,
        theses: theses,
        awards: awards,
        intellectual_properties: intelectualProp,
        total: publications + theses + awards + intelectualProp
      })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao retornar todas as imagens de users' })
  }
})

module.exports = router
