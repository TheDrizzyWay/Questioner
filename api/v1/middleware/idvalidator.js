export default (req, res, next) => {
  const { id } = req.params;
  const newId = parseInt(id, 10);

  if (!newId) {
    return res.status(422).json({ status: 422, error: 'Invalid id.' });
  }
  req.params.id = newId;
  return next();
};
