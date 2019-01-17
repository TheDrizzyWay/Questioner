const emptySignup = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  phonenumber: '',
};

const missingSignup = {
  username: 'username',
  email: 'email@email.com',
  password: 'password',
  password_confirmation: 'password',
};

const correctSignup = {
  firstname: 'freddy',
  lastname: 'krueger',
  username: 'freddyk',
  email: 'freddyk@email.com',
  password: 'freddy',
  password_confirmation: 'freddy',
  phonenumber: '08012345555',
};

const emptyLogin = {
  email: '',
  password: '',
};

const missingLogin = {
  password: 'password',
};

const notExistLogin = {
  email: 'myers234@email.com',
  password: 'myers13',
};

const correctLogin = {
  email: 'myers@email.com',
  password: 'mikemyers',
};

const nonMatchingLogin = {
  email: 'myers@email.com',
  password: 'myers15',
};

export {
  emptySignup, missingSignup, correctSignup,
  emptyLogin, missingLogin, correctLogin,
  notExistLogin, nonMatchingLogin,
};
