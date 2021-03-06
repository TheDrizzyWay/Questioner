import User from '../models/Users';
import Hash from '../utils/passwords';
import Jwt from '../utils/jwt';
import Rsvp from '../models/Rsvps';
import Question from '../models/Questions';
import Comment from '../models/Comments';
import { convertName } from '../utils/stringfunctions';
import { successResponse, errorResponse } from '../utils/responses';

export default class UsersController {
  /**
   * @description Signs up a user
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} contains details about the newly created user account
   */

  static async signUp(req, res) {
    const user = new User(req.body);

    user.firstname = convertName(user.firstname);
    user.lastname = convertName(user.lastname);
    user.password = Hash.hashPassword(user.password);

    const userExists = await User.getUserByEmail(user.email);
    if (userExists) return errorResponse(res, 409, 'This email address is already taken.');

    const usernameExists = await User.getUserByUsername(user.username);
    if (usernameExists) return errorResponse(res, 409, 'This username is already taken.');

    const newUser = await user.signUp();
    const { id, username, isadmin } = newUser;
    const token = await Jwt.generateToken({ id, username, isadmin });
    return successResponse(res, 201, 'You have signed up successfully', [{ token, isadmin, newUser }]);
  }

  /**
   * @description Logs in an existing user
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} contains an authentication token encoded with the user's details
   */

  static async logIn(req, res) {
    const { email, password } = req.body;

    const result = await User.logIn(email);

    if (!result) {
      return errorResponse(res, 404, `We couldn't find an account for ${email}.`);
    }

    const { password: userPassword } = result;
    if (!Hash.comparePassword(password, userPassword)) {
      return errorResponse(res, 401, 'Invalid email and password combination.');
    }

    const { id, username, isadmin } = result;
    const token = await Jwt.generateToken({ id, username, isadmin });
    return successResponse(res, 200, 'You are logged in.', [{ token, isadmin, id }]);
  }

  /**
   * @description Edits a user's details
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} contains details of the updated user
   */

  static async editUser(req, res) {
    const { id } = req.user;
    const userExists = await User.getUserById(id);

    const {
      firstname, lastname, username, email, password, phonenumber,
    } = req.body;

    userExists.firstname = firstname ? convertName(firstname) : userExists.firstname;
    userExists.lastname = lastname ? convertName(lastname) : userExists.lastname;
    userExists.username = username ? username.trim() : userExists.username;
    userExists.email = email || userExists.email;
    if (password) {
      userExists.password = Hash.hashPassword(password);
    }
    userExists.phonenumber = phonenumber ? phonenumber.trim() : userExists.phonenumber;

    const result = await User.updateUser(id, userExists);
    return successResponse(res, 200, 'Your details have been updated successfully', result);
  }

  /**
   * @description Gets all users
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {array} contains all registered users
   */

  static async getAllUsers(req, res) {
    const result = await User.getAllUsers();
    return successResponse(res, 200, 'Users found.', result);
  }

  /**
   * @description Gets the details of the current user
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} contains details and activities of the user
   */

  static async getProfile(req, res) {
    const { id } = req.user;
    const response = 'yes';

    const details = await Promise.all([
      User.getUserDetails(id),
      Rsvp.getJoinedMeetups(id, response),
      Question.getMyQuestions(id),
      Comment.getMyCommentedQuestions(id),
      Comment.getMyComments(id),
    ]);

    const finalResult = {
      firstname: details[0].firstname,
      lastname: details[0].lastname,
      username: details[0].username,
      joinedMeetups: details[1].length || 0,
      questionsPosted: details[2].length || 0,
      commentedOn: details[3].length || 0,
      allComments: details[4].length || 0,
    };

    return successResponse(res, 200, 'Profile Details found', [finalResult]);
  }
}
