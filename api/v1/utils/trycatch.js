import { badResponse } from './responses';

const tryCatch = controller => async (req, res) => {
  try {
    await controller(req, res);
  } catch (error) {
    return badResponse(res, 500, error.message);
  }
  return true;
};

export default tryCatch;
