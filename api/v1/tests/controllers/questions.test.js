import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { correctLogin, userLogin } from '../mockdata/userdata';
import {
  missing, correct, invalidmeetup,
  correct2, wrongMeetup,
} from '../mockdata/questiondata';

chai.use(chaiHttp);
let adminToken;
let userToken;

describe('Questions', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(correctLogin);

    adminToken = response.body.data[0].token;

    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userLogin);

    userToken = userResponse.body.data[0].token;
  });

  describe('PATCH /:id/upvote', () => {
    it('it should return 404 if question id does not exist', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/5/upvote')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });

  describe('PATCH /:id/downvote', () => {
    it('it should return 404 if question id does not exist', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/5/downvote')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /', () => {
    it('it should return 400 if required fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(missing);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 404 if meetup id does not exist', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(invalidmeetup);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('it should return 401 if user has not joined meetup', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(wrongMeetup);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should return 201 if question is created successfully', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(correct);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });

    it('should return 201 if question is created successfully', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correct2);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });

  describe('PATCH /:id/upvote', () => {
    it('it should return 400 if question creator tries to vote', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/upvote')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 200 if upvote is successfull', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/upvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('it should return 400 if user downvotes after upvoting', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/downvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 200 if user removes upvote', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/upvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('PATCH /:id/downvote', () => {
    it('it should return 400 if question creator tries to vote', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/2/downvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 200 if downvote is successfull', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/2/downvote')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('it should return 400 if user upvotes after downvoting', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/2/upvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 200 if user removes downvote', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/upvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /questions/:id', () => {
    it('should return 200 if questions are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/questions/1')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
