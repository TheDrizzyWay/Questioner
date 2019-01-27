import pool from '../database/index';

export default class Meetup {
  constructor(meetup) {
    this.topic = meetup.topic;
    this.location = meetup.location;
    this.happeningon = meetup.happeningon;
    this.image = meetup.image;
    this.tags = meetup.tags;
  }

  async createMeetup() {
    const queryString = `INSERT INTO meetups (topic, location, happeningon,
      image, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [this.topic, this.location, this.happeningon,
      this.image, this.tags];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getAllMeetups() {
    const queryString = 'SELECT * FROM meetups';
    const { rows } = await pool.query(queryString);
    return rows;
  }

  static async getMeetupById(id) {
    const queryString = 'SELECT * FROM meetups WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async updateMeetup(id, meetup) {
    const {
      topic, location, happeningon, image, tags,
    } = meetup;
    const queryString = `UPDATE meetups SET topic = $1, location = $2, happeningon = $3,
     image = $4, tags = $5 WHERE id = $6 RETURNING *`;
    const values = [topic, location, happeningon, image, tags, id];
    const { rows } = await pool.query(queryString, values);
    return rows[0];
  }

  static async getUpcomingMeetups(currentDate) {
    const queryString = 'SELECT * FROM meetups WHERE happeningon > $1 ORDER BY happeningon';
    const values = [currentDate];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }

  static async deleteMeetup(id) {
    const queryString = 'DELETE FROM meetups WHERE id = $1';
    const values = [id];
    const result = await pool.query(queryString, values);
    return result;
  }

  static async getTopQuestions(meetupid) {
    const queryString = `SELECT * FROM questions WHERE meetupid = $1 ORDER BY
    (upvotes - downvotes) DESC LIMIT 5`;
    const values = [meetupid];
    const { rows } = await pool.query(queryString, values);
    return rows;
  }
}
