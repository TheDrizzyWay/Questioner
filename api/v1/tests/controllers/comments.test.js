import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { userLogin } from '../mockdata/userdata';

chai.use(chaiHttp);
let userToken;

describe('Comments', () => {
  before(async () => {
    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userLogin);

    userToken = userResponse.body.data[0].token;
  });

  describe('GET /:id', () => {
    it('should return an empty array if no comments are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/comments/1')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('No comments found for this question.');
    });
  });

  describe('POST /', () => {
    it('should return 400 for missing comment', async () => {
      const res = await chai.request(app)
        .post('/api/v1/comments/')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          questionid: '1',
          comment: '',
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 404 if question does not exist', async () => {
      const res = await chai.request(app)
        .post('/api/v1/comments')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          questionid: '10',
          comment: 'comment body **',
        });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 201 for successfull comment', async () => {
      const res = await chai.request(app)
        .post('/api/v1/comments')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({
          questionid: '1',
          comment: 'comment body **',
        });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /:id', () => {
    it('should return 200 if comments are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/comments/1')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
