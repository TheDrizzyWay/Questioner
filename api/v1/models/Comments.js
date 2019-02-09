import pool from '../database/index';

export default class Comment {
  constructor(usercomment) {
    this.questionid = usercomment.questionid;
    this.title = usercomment.title;
    this.body = usercomment.body;
    this.comment = usercomment.comment;
    this.userid = usercomment.userid;
    this.postedby = usercomment.postedby;
  }

  async createComment() {
    const queryString = `INSERT INTO comments (questionid, title, body, comment, userid, postedby)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [this.questionid, this.title, this.body, this.comment, this.userid, this.postedby];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getCommentsByQuestion(id) {
    const queryString = 'SELECT * FROM comments WHERE questionid = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async getMyCommentedQuestions(id) {
    const queryString = 'SELECT DISTINCT questionid FROM comments WHERE userid = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async getMyComments(id) {
    const queryString = 'SELECT questionid FROM comments WHERE userid = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }
}
