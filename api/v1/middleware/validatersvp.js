import validator from 'validator';

export default (req, res, next) => {
  const errors = {};
  const rsvp = req.body;
  const { meetup, response } = rsvp;

  const fields = [meetup, response];
  let emptyField;
  fields.map((field) => {
    if (validator.isEmpty(field)) {
      emptyField = true;
    }
    return emptyField;
  });
  if (emptyField) return res.status(400).json({ status: 400, error: 'Please fill in all fields.' });

  if (!validator.isIn(response.toLowerCase(), ['yes', 'no', 'maybe'])) {
    errors.response = 'Please insert a valid response.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: 400, error: errors });
  }
  return next();
};
