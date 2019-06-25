const router = require('express').Router()

router.use('/authenticate', require('./authenticate'))
router.use('/recover', require('./recover'))
router.use('/files', require('./files'))
router.use('/statistics', require('./statistic'))
// communications
router.use('/medias', require('./show/communications/medias'))
router.use('/events', require('./show/communications/events'))
router.use('/news', require('./show/communications/news'))

// outcomes
router.use('/awards', require('./show/outcomes/awards'))
router.use('/patents', require('./show/outcomes/patents'))
router.use('/publications', require('./show/outcomes/publications'))
router.use('/software', require('./show/outcomes/software'))
router.use('/theses', require('./show/outcomes/theses'))
// projetos
router.use('/projects', require('./show/projects'))

module.exports = router
