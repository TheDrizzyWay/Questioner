const emptySignup = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  phonenumber: '',
};

const missingSignup = {
  username: 'username',
  email: 'email@email.com',
  password: 'password',
};

const correctSignup = {
  firstname: 'micheal',
  lastname: 'myers',
  username: 'myers13',
  email: 'myers@email.com',
  password: 'myers13',
  phonenumber: '08011112222',
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
  password: 'myers13',
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
