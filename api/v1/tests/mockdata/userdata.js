const correctLogin = {
  email: 'jasonv@email.com',
  password: 'jasonv',
};

const userLogin = {
  email: 'myers@email.com',
  password: 'mikemyers',
};

const correctEdit = {
  firstname: 'Jason',
  lastname: 'Voorhees',
  username: 'jasonv2',
};

const correctEdit2 = {
  email: 'jasonv@email.com',
  password: 'jasonv',
  password_confirmation: 'jasonv',
  phonenumber: '08011112222',
};

const invalidEdit = {
  firstname: 'a',
  phonenumber: '0801111222233',
};

export {
  correctLogin, correctEdit, invalidEdit,
  correctEdit2, userLogin,
};
