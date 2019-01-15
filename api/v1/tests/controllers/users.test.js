import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  correctLogin, correctEdit, invalidEdit,
  correctEdit2,
} from '../mockdata/userdata';

chai.use(chaiHttp);
let adminToken;

describe('Users', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(correctLogin);

    adminToken = response.body.data;
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
});
