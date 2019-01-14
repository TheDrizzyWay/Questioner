import User from '../models/Users';
import Hash from '../utils/passwords';
import Jwt from '../utils/jwt';
import convertName from '../utils/convertname';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  /**
   * @description Signs up a user
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and user details
   */

  signUp: async (req, res) => {
    const user = new User(req.body);

    user.firstname = convertName(user.firstname);
    user.lastname = convertName(user.lastname);
    user.password = Hash.hashPassword(user.password);
    user.email = user.email.trim();
    user.username = user.username.trim();

    const userExists = await User.getUserByEmail(user.email);
    if (userExists) return errorResponse(res, 409, 'This email address is already taken.');

    const usernameExists = await User.getUserByUsername(user.username);
    if (usernameExists) return errorResponse(res, 409, 'This username is already taken.');

    const newUser = await user.signUp();
    return successResponse(res, 201, 'You have signed up successfully', newUser);
  },

  /**
   * @description Logs in an existing user
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and token
   */

  logIn: async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    const result = await User.logIn(email);

    if (!result) {
      return errorResponse(res, 401, `We couldn't find an account for ${email}.`);
    }

    const { password: userPassword } = result;
    if (!Hash.comparePassword(password, userPassword)) {
      return errorResponse(res, 401, 'Invalid email and password combination.');
    }

    const { id, username, isadmin } = result;
    const token = await Jwt.generateToken({ id, username, isadmin });
    return successResponse(res, 200, 'You are logged in.', token);
  },

  /**
   * @description Edits a user's details
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and user details
   */
  editUser: async (req, res) => {
    const { id } = req.user;
    const userExists = await User.getUserById(id);

    const {
      firstname, lastname, username, email, password, phonenumber,
    } = req.body;

    userExists.firstname = firstname || userExists.firstname;
    userExists.lastname = lastname || userExists.lastname;
    userExists.username = username || userExists.username;
    userExists.email = email || userExists.email;
    if (password) {
      userExists.password = Hash.hashPassword(password);
    }
    userExists.phonenumber = phonenumber || userExists.phonenumber;

    const result = await User.updateUser(id, userExists);
    return successResponse(res, 200, 'Your details have been updated successfully', result);
  },

  /**
   * @description Gets all users
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and a list of all users
   */
  getAllUsers: async (req, res) => {
    const result = await User.getAllUsers();
    return successResponse(res, 200, 'Users found.', result);
  },
};
