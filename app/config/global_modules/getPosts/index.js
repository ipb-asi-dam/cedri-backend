module.exports = async (req, Model) => {
  const limit = req.query.limit
  const page = req.query.page
  const offset = limit * (page - 1)
  const showMy = (req.query.showMy === 'true' || req.query.showMy === true)
  let elements
  if (req.user.isAdmin !== true || showMy) {
    elements = await Model.scope('posts').findAndCountAll({
      limit,
      offset,
      where: {
        investigatorId: +req.user.id
      }
    })
  } else {
    elements = await Model.scope('posts').findAndCountAll({
      limit,
      offset
    })
  }
  const pagesTotal = Math.ceil(elements.count / limit)
  const countTotal = elements.count
  return { elements: elements.rows, pagesTotal, countTotal }
}
