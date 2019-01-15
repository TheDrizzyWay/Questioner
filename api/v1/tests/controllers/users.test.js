import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  correctLogin, correctEdit, invalidEdit,
  correctEdit2, userLogin,
} from '../mockdata/userdata';

chai.use(chaiHttp);
let adminToken;
let userToken;

describe('Users', () => {
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
  describe('PUT /edit', () => {
    it('should return 401 if no token is received', async () => {
      const res = await chai.request(app)
        .put('/api/v1/users/edit')
        .send(correctEdit);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should return 401 for invalid token', async () => {
      const res = await chai.request(app)
        .put('/api/v1/users/edit')
        .set({ Authorization: null })
        .send(correctEdit);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 if fields contain invalid details', async () => {
      const res = await chai.request(app)
        .put('/api/v1/users/edit')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(invalidEdit);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 for successfull update', async () => {
      const res = await chai.request(app)
        .put('/api/v1/users/edit')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctEdit);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('should return 200 for successfull partial update', async () => {
      const res = await chai.request(app)
        .put('/api/v1/users/edit')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(correctEdit2);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /users', () => {
    it('should return 403 if user is not an admin', async () => {
      const res = await chai.request(app)
        .get('/api/v1/users')
        .set({ Authorization: `Bearer ${userToken}` });
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
    });

    it('should get all users and return 200', async () => {
      const res = await chai.request(app)
        .get('/api/v1/users')
        .set({ Authorization: `Bearer ${adminToken}` });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
