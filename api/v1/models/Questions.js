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

  static async getQuestionById(id) {
    const text = 'SELECT * FROM questions WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }

  static async upvoteQuestion(id) {
    const text = 'UPDATE questions SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }

  static async updateVotesTable(userid, questionid, vote) {
    const text = `INSERT INTO votes (userid, questionid, vote) VALUES
    ($1, $2, $3)`;
    const values = [userid, questionid, vote];
    const result = await pool.query(text, values);
    return result;
  }

  static async ifVoted(userid, questionid) {
    const text = 'SELECT * FROM votes WHERE userid = $1 AND questionid = $2';
    const values = [userid, questionid];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }
}
