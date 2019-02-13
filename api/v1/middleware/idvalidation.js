import { errorResponse } from '../utils/responses';

export default (req, res, next) => {
  /**
   * @description Validates the request params where specified
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @param {object} next - The next middleware
   * @returns Status code and error message or next()
   */

  const { id } = req.params;
  const newId = parseInt(id, 10);

  if (!newId) {
    return errorResponse(res, 422, 'Invalid id.');
  }
  req.params.id = newId;
  return next();
};
