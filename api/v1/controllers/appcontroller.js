export default {
  getUndefined: (req, res) => res.status(404).send({ message: 'Invalid request.' }),
};
