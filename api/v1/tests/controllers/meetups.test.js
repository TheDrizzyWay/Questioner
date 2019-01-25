import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { correctLogin, userLogin } from '../mockdata/userdata';
import {
  emptyMeetup, wrongDate, correctMeetup,
  invalidEdit, correctMeetup2, correctMeetup3,
  correctMeetup4, correctMeetup5,
} from '../mockdata/meetupdata';

chai.use(chaiHttp);
let adminToken;
let userToken;

describe('Meetups', () => {
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
  describe('GET /', () => {
    it('should return an empty array if no meetups exist', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('No meetups found.');
    });
  });

  describe('GET /upcoming', () => {
    it('should return an empty array if no upcoming meetups exist', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/upcoming')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('No upcoming meetups found.');
    });
  });

  describe('POST /', () => {
    it('should return 400 if required fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(emptyMeetup);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 if meetup date is past', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(wrongDate);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 201 for successfull creation', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctMeetup);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });

    it('should return 201 for successfull creation', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctMeetup4);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /', () => {
    it('should return a list of all meetups', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /:id', () => {
    it('should return 404 if id does not exist', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/10')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 422 if id is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/abc')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(422);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 if id exists', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/1')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('PUT /:id', () => {
    it('should return 400 if fields contain invalid details', async () => {
      const res = await chai.request(app)
        .put('/api/v1/meetups/1')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(invalidEdit);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 if meetup date is past', async () => {
      const res = await chai.request(app)
        .put('/api/v1/meetups/1')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(wrongDate);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 for successfull update', async () => {
      const res = await chai.request(app)
        .put('/api/v1/meetups/1')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctMeetup2);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('should return 200 for successfull partial update', async () => {
      const res = await chai.request(app)
        .put('/api/v1/meetups/1')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctMeetup3);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('should return 200 for successfull partial update', async () => {
      const res = await chai.request(app)
        .put('/api/v1/meetups/1')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctMeetup5);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /upcoming', () => {
    it('should return a list of upcoming meetups', async () => {
      const res = await chai.request(app)
        .get('/api/v1/meetups/upcoming')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('DELETE /', () => {
    it('should return 404 if meetup not found', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/meetups/10')
        .set({ Authorization: `Bearer ${adminToken}` });
      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Meetup not found.');
    });

    it('should return 200 on successfull delete', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/meetups/2')
        .set({ Authorization: `Bearer ${adminToken}` });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
