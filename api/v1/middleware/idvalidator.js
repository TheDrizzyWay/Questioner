import validator from 'validator';

export default (req, res, next) => {
  const { id } = req.params;

  if (!validator.isNumeric(id)) {
    return res.status(422).json({ status: 422, error: 'Invalid id.' });
  }
  const newId = parseInt(id, 10);
  req.params.id = newId;
  return next();
};
