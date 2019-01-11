import User from '../models/Users';
import Hash from '../utils/passwords';
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
      return res.status(401).send({ success: false, message: 'User account not found.' });
    }
    const { password: userPassword } = result;
    if (!Hash.comparePassword(password, userPassword)) {
      return res.status(401).send({
        success: false,
        message: 'Invalid email/password combination.',
      });
    }
    const { id, role } = result;
    const token = await Hash.generateToken({ id, role });
    return res.status(200).send({ success: true, message: 'You are now logged in.', token });
  },
};
