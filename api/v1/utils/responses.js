const goodResponse = (res, statusCode, message, data) => {
  let response = {
    status: statusCode,
    data,
  };
  if (message) {
    response = {
      status: statusCode,
      message,
      data,
    };
  }
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
