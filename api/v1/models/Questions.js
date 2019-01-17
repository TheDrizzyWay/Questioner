import pool from '../database/index';

export default class Question {
  constructor(question) {
    this.meetupid = question.meetupid;
    this.title = question.title;
    this.body = question.body;
    this.userid = question.userid;
  }

  async createQuestion() {
    const text = `INSERT INTO questions (meetupid, title, body, userid)
    VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [this.meetupid, this.title, this.body, this.userid];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }
}
