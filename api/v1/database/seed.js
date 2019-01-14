import Hash from '../utils/passwords';
import pool from './index';

console.log('seeding database');

(async () => {
  const password = 'jasonv';
  const hashed = Hash.hashPassword(password);
  let result;
  const params = ['Jason', 'Voorhees', 'jasonv', 'jasonv@email.com', hashed, '08011112234', true];
  try {
    result = await pool.query(`INSERT INTO users (firstname, lastname, username, email, password, phonenumber, isadmin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, params);
    return result;
  } catch (error) {
    return error;
  }
})();
