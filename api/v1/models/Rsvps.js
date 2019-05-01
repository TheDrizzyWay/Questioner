import pool from '../database/index';

export default class Rsvp {
  constructor(rsvp) {
    this.response = rsvp.response;
  }

  async joinMeetup(meetupId, userId) {
    const queryString = 'INSERT INTO rsvps (meetupid, userid, response) VALUES ($1, $2, $3) RETURNING *';
    const values = [meetupId, userId, this.response];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getJoinedMeetups(userId, response, offset, limit) {
    const queryString = 'SELECT * FROM rsvps WHERE userid =$1 AND response = $2 OFFSET $3 LIMIT $4';
    const values = [userId, response, offset, limit];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async getUserByRsvp(meetupId, userId) {
    const queryString = 'SELECT * FROM rsvps WHERE meetupid = $1 AND userid = $2';
    const values = [meetupId, userId];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getAllUserResponses(id) {
    const queryString = 'SELECT * FROM rsvps WHERE userid = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async getJoinedUsers(meetupId) {
    const response = 'yes';
    const queryString = `SELECT COUNT (CASE WHEN r.meetupid = $1 AND r.response = $2 THEN 1 END)
    FROM rsvps r`;
    const values = [meetupId, response];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }
}
