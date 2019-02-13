import { errorResponse } from './responses';

/**
 * @description Wraps a controller function in a try-catch block
 * @param  {object} req - The request object
 * @param  {object} res - The response object
 * @returns Status code and error message if an error is thrown
 */

/* istanbul ignore next */
const tryCatch = controller => async (req, res) => {
  try {
    await controller(req, res);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
  return true;
};

export default tryCatch;
