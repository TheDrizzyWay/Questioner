const goodResponse = (res, statusCode, message, data) => {
  const response = {
    status: statusCode,
    data,
  };
  if (message) response.message = message;
  return res.status(statusCode).json(response);
};

const badResponse = (res, statusCode, message) => {
  const response = {
    status: statusCode,
    error: message,
  };
  return res.status(statusCode).json(response);
};

export { goodResponse, badResponse };
