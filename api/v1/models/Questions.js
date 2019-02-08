import pool from '../database/index';

export default class Question {
  constructor(question) {
    this.meetupid = question.meetupid;
    this.title = question.title;
    this.body = question.body;
    this.userid = question.userid;
    this.postedby = question.postedby;
  }

  async createQuestion() {
    const queryString = `INSERT INTO questions (meetupid, title, body, userid, postedby)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [this.meetupid, this.title, this.body, this.userid, this.postedby];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getQuestionById(id) {
    const queryString = 'SELECT * FROM questions WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getQuestionsByMeetup(id) {
    const queryString = 'SELECT * FROM questions WHERE meetupid = $1 ORDER BY createdon';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async upvoteQuestion(id) {
    const queryString = 'UPDATE questions SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async changeUpvoteQuestion(id) {
    const queryString = 'UPDATE questions SET upvotes = upvotes - 1 WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async downvoteQuestion(id) {
    const queryString = 'UPDATE questions SET downvotes = downvotes + 1 WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async changeDownvoteQuestion(id) {
    const queryString = 'UPDATE questions SET downvotes = downvotes - 1 WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async updateVotesTable(userid, questionid, vote) {
    const queryString = `INSERT INTO votes (userid, questionid, vote) VALUES
    ($1, $2, $3)`;
    const values = [userid, questionid, vote];
    const result = await pool.query(queryString, values);
    return result;
  }

  static async changeVotesTable(userid, questionid) {
    const queryString = 'DELETE FROM votes WHERE userid = $1 AND questionid = $2';
    const values = [userid, questionid];
    const result = await pool.query(queryString, values);
    return result;
  }

  static async ifVoted(userid, questionid) {
    const queryString = 'SELECT * FROM votes WHERE userid = $1 AND questionid = $2';
    const values = [userid, questionid];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getMyQuestions(id) {
    const queryString = 'SELECT id FROM questions WHERE userid = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }
}
