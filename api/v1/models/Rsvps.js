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

  static async getJoinedMeetups(userId, response) {
    const queryString = 'SELECT * FROM rsvps WHERE userid =$1 AND response = $2';
    const values = [userId, response];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async getUserByRsvp(meetupId, userId) {
    const queryString = 'SELECT * FROM rsvps WHERE meetupid = $1 AND userid = $2';
    const values = [meetupId, userId];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }
}
