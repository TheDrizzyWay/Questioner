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
    const text = `INSERT INTO users (firstname, lastname,
      username, email, password,  phonenumber)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [this.firstname, this.lastname, this.username,
      this.email, this.password, this.phonenumber];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }

  static async getUserByEmail(email) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }

  static async logIn(email) {
    const text = 'SELECT id, password FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }
}
