import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  emptySignup, missingSignup, correctSignup,
  emptyLogin, missingLogin, correctLogin,
  notExistLogin, nonMatchingLogin,
} from '../mockdata/authdata';

chai.use(chaiHttp);

describe('Auth', () => {
  describe('POST /signup', () => {
    it('should return 400 if data fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(emptySignup);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 if one or more fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(missingSignup);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 201 for successfull signup', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(correctSignup);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });

  describe('POST /login', () => {
    it('should return 400 if data fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(emptyLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 if one or more fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(missingLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 401 if user account not found', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(notExistLogin);
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should return 401 for non-matching details', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(nonMatchingLogin);
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 for successfull login', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(correctLogin);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
