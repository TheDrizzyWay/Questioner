import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  missing, invalid, correct,
  correct2, correct3, invalidrsvp,
  wrongrsvp, rsvp, missingrsvp,
} from '../mockdata/meetupdata';

chai.use(chaiHttp);

describe('Meetups', () => {
  describe('GET /meetups', () => {
    it('should return an empty array if no meetups are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /meetups/upcoming', () => {
    it('should return an empty array if no upcoming meetups are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/upcoming');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('POST /meetups', () => {
    it('it should return 400 if required fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .send(missing);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if fields contain invalid data', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .send(invalid);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 201 if meetup is created successfully', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .send(correct);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });

    it('should create meetup with appropriate id', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .send(correct2);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });

    it('should create meetup with appropriate id', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .send(correct3);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /meetups/:id', () => {
    it('should return 422 if id is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/abc');

      expect(res).to.have.status(422);
      expect(res.body).to.have.property('error');
    });

    it('should return 404 if id does not exist', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/10');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 if request is successfull', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/1');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /meetups', () => {
    it('should get all meetups and return 200', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /meetups/upcoming', () => {
    it('should get all upcoming meetups', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/upcoming');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('POST /meetups/:id/rsvps', () => {
    it('should return 404 if meetup does not exist', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/10/rsvps')
        .send(invalidrsvp);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if fields contain invalid data', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .send(wrongrsvp);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 if response is successfull', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .send(rsvp);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('it should return 400 if required fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .send(missingrsvp);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});
