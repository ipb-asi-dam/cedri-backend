const router = require('express').Router()
const { media: Media } = require('../../../../../../models')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const media = await Media.findByPk(id)
    if (!media) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Media com id ' + id + ' não encontrada' })
    }
    media.destroy()
    return res
      .status(200)
      .jsend
      .success({ message: 'Media deletada com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar media com id ' + id })
  }
})
module.exports = router
