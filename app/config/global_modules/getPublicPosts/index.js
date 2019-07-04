module.exports = async (req, Model, optionsObj) => {
  const limit = req.query.limit
  const page = req.query.page
  const offset = limit * (page - 1)
  if (!optionsObj) optionsObj = {}

  optionsObj.limit = limit
  optionsObj.page = page
  optionsObj.offset = offset

  const elements = await Model.scope('public').findAll(optionsObj)

  return elements
}
