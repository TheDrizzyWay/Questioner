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
    const text = `INSERT INTO meetups (topic, location, happeningon,
      image, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [this.topic, this.location, this.happeningon,
      this.image, this.tags];
    const { rows } = await pool.query(text, values);
    return rows[0];
  }

  static async getAllMeetups() {
    const text = 'SELECT * FROM meetups';
    const { rows } = await pool.query(text);
    return rows;
  }
}
