const router = require('express').Router()

router.use('/authenticate', require('./authenticate'))
router.use('/recover', require('./recover'))
router.use('/images', require('./images'))
router.use('/statistics', require('./statistic'))
// communications
router.use('/medias', require('./show/communications/medias'))
// outcomes
router.use('/awards', require('./show/outcomes/awards'))
router.use('/patents', require('./show/outcomes/patents'))
router.use('/publications', require('./show/outcomes/publications'))
router.use('/software', require('./show/outcomes/software'))
router.use('/theses', require('./show/outcomes/theses'))
// projetos
router.use('/projects', require('./show/projects'))

module.exports = router
