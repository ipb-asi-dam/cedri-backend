const router = require('express').Router()
const { event: Event } = require('../../../../../../models')

router.delete('/:id', async (req, res) => {
  const id = +req.params.id
  try {
    const event = await Event.findByPk(id)
    if (!event) {
      return res
        .status(404)
        .jsend
        .fail({ message: 'Evento com id ' + id + ' não encontrado' })
    }
    event.destroy()
    return res
      .status(200)
      .jsend
      .success({ message: 'Event deletado com sucesso!' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .jsend
      .error({ message: 'Erro ao deletar evento com id ' + id })
  }
})
module.exports = router
