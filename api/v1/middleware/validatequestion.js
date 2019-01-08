import validator from 'validator';

export default (req, res, next) => {
  const errors = {};
  const question = req.body;
  const {
    meetup, title, body, createdBy,
  } = question;

  const fields = [meetup, title, body, createdBy];
  let emptyField;
  fields.map((field) => {
    if (validator.isEmpty(field)) {
      emptyField = true;
    }
    return emptyField;
  });
  if (emptyField) return res.status(400).send({ status: 400, error: 'Please fill in all fields.' });

  if (!parseInt(meetup, 10)) {
    errors.meetup = 'Meetup id should be a number';
  }
  if (!parseInt(createdBy, 10)) {
    errors.createdBy = 'Meetup id should be a number';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: 400, error: errors });
  }
  return next();
};
