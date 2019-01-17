import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { correctLogin, userLogin } from '../mockdata/userdata';

chai.use(chaiHttp);
let adminToken;
let userToken;

describe('Rsvps', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(correctLogin);

    adminToken = response.body.data;

    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userLogin);

    userToken = userResponse.body.data;
  });

  describe('GET /rsvps', () => {
    it('should return an empty array if no joined meetups are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/rsvps')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('You have not joined any meetups yet.');
    });
  });

  describe('POST /:meetupid/rsvps', () => {
    it('should return 400 for missing response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: '' });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 for invalid response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'wrong' });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 404 if meetup does not exist', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/10/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'yes' });
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 for successfull response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'Yes' });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('should return 200 for successfull negative response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send({ response: 'No' });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('should return 400 if user already responded', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'Yes' });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /rsvps', () => {
    it('should return 200 if joined meetups are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/rsvps')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
