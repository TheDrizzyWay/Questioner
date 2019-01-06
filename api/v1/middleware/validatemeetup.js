export default (req, res, next) => {
  const errors = {};
  const checkInput = /[!@#$%^&*()_+\-=[\]{};':"\\|<>/?]/;
  const checkImgUrl = /(http(s?):(\/){2})([^/])([/.\w\s-])*\.(?:jpg|png)/;
  const checkDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/;
  const meetup = req.body;
  const { images, tags } = meetup;

  if (!meetup.topic) {
    errors.topic = 'A topic is required';
  }
  if (checkInput.test(meetup.topic)) {
    errors.validTopic = 'Your topic should contain only alphabets and numbers.';
  }
  if (!meetup.location) {
    errors.location = 'A location is required';
  }
  if (checkInput.test(meetup.location)) {
    errors.validTopic = 'Your location should contain only alphabets and numbers.';
  }
  if (!meetup.happeningOn) {
    errors.happeningOn = 'A date and time for the meetup is required';
  }
  if (!checkDate.test(meetup.happeningOn)) {
    errors.date = 'Please insert a valid date and time';
  }
  if (images) {
    images.forEach((image) => {
      if (!checkImgUrl.test(image)) {
        errors.images = `${image} is not a valid image link`;
      }
    });
  }
  if (tags) {
    tags.forEach((tag) => {
      if (checkInput.test(tag)) {
        errors.tags = `${tag} should contain only alphabets and numbers.`;
      }
    });
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).send({ status: 400, error: errors });
  }
  return next();
};
