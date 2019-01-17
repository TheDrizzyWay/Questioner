import pool from '../database/index';

export default class User {
  constructor(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.phonenumber = user.phonenumber;
  }

  async signUp() {
    const queryString = `INSERT INTO users (firstname, lastname,
      username, email, password,  phonenumber)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [this.firstname, this.lastname, this.username,
      this.email, this.password, this.phonenumber];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getUserById(id) {
    const queryString = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getUserByEmail(email) {
    const queryString = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getUserByUsername(username) {
    const queryString = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async logIn(email) {
    const queryString = 'SELECT id, password, username, isadmin FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async updateUser(id, user) {
    const {
      firstname, lastname, username, email, password, phonenumber,
    } = user;
    const queryString = `UPDATE users SET firstname = $1, lastname = $2, username = $3,
     email = $4, password = $5, phonenumber =$6 WHERE id = $7 RETURNING *`;
    const values = [firstname, lastname, username, email, password, phonenumber, id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getAllUsers() {
    const queryString = 'SELECT * FROM users';
    const { rows } = await pool.query(queryString);
    return rows;
  }
}
