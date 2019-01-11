import User from '../models/Users';
import Hash from '../utils/passwords';
import Jwt from '../utils/jwt';
import convertName from '../utils/convertname';
import { goodResponse, badResponse } from '../utils/responses';

export default {
  signUp: async (req, res) => {
    const user = new User(req.body);

    user.firstname = convertName(user.firstname);
    user.lastname = convertName(user.lastname);
    user.password = Hash.hashPassword(user.password);
    if (user.othername) {
      user.othername = convertName(user.othername);
    }
    user.email = user.email.trim();

    const userExists = await User.getUserByEmail(user.email);
    if (userExists) return badResponse(res, 409, 'This email address is already taken.');

    const newUser = await user.signUp();
    return goodResponse(res, 201, 'You have signed up successfully', newUser);
  },

  logIn: async (req, res) => {
    const { email, password } = req.body;
    const result = await User.logIn(email);

    if (!result) {
      return badResponse(res, 401, 'User account not found.');
    }

    const { password: userPassword } = result;
    if (!Hash.comparePassword(password, userPassword)) {
      return badResponse(res, 401, 'Invalid email/password combination.');
    }

    const { id, username, isadmin } = result;
    const token = await Jwt.generateToken({ id, username, isadmin });
    return goodResponse(res, 200, 'You are logged in.', token);
  },
};
