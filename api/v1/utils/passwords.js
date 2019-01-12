import bcrypt from 'bcryptjs';

export default class Hash {
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  static comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }
}
