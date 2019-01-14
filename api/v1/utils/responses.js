/**
 * @description Returns a successfull response
 * @param  {object} res - The response object
 * @param {number} statusCode - The response status code
 * @param {string} message - The response message
 * @returns status code, message and response data
 */

const successResponse = (res, statusCode, message, data) => {
  const response = {
    status: statusCode,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * @description Returns an error response
 * @param  {object} res - The response object
 * @param {number} statusCode - The response status code
 * @param {string} message - The response message
 * @returns status code and error message
 */

const errorResponse = (res, statusCode, message) => {
  const response = {
    status: statusCode,
    error: message,
  };
  return res.status(statusCode).json(response);
};

export { successResponse, errorResponse };
