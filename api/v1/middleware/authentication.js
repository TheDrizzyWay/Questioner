import Jwt from '../utils/jwt';
import { errorResponse } from '../utils/responses';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'undefined') {
    errorResponse(res, 401, 'Unauthorized - Header Not Set');
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    errorResponse(res, 401, 'Access Denied. Please Log In.');
    return;
  }

  try {
    const decoded = await Jwt.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    errorResponse(res, 500, 'Error verifying user.');
  }
};

export const adminAuth = (req, res, next) => {
  const { isadmin } = req.user;
  if (isadmin !== true) {
    return errorResponse(res, 403, 'Access Denied. For Admins only.');
  }
  return next();
};
