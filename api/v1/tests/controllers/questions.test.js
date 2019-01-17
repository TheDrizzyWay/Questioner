import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { correctLogin, userLogin } from '../mockdata/userdata';
import {
  missing, correct, invalidmeetup,
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

    adminToken = response.body.data;

    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userLogin);

    userToken = userResponse.body.data;
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

    it('should return 201 if question is created successfully', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(correct);

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

    it('it should return 400 if user tries to vote twice', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/upvote')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('You have already upvoted this question');
    });
  });
});
