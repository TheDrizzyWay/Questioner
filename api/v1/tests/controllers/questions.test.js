import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { userLogin } from '../mockdata/userdata';
import {
  missing, correct, invalidmeetup,
} from '../mockdata/questiondata';

chai.use(chaiHttp);
let userToken;

describe('Questions', () => {
  before(async () => {
    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userLogin);

    userToken = userResponse.body.data;
  });
  describe('POST /questions', () => {
    it('it should return 400 if required fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .set({ Authorization: `Bearer ${userToken}` })
        .send(missing);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if meetup id does not exist', async () => {
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
});
