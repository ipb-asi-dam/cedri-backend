module.exports = async (req, Model, optionsObj) => {
  let elements
  if (!optionsObj) {
    elements = await Model.scope('public').findAll()
  } else {
    elements = await Model.scope('public').findAll(optionsObj)
  }
  return elements
}
