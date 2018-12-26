import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  missing, invalid, correct,
  correct2,
} from '../mockdata/questiondata';

chai.use(chaiHttp);

describe('Questions', () => {
  describe('POST /questions', () => {
    it('it should return 400 if required fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .send(missing);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if fields contain invalid data', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .send(invalid);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 201 if question is created successfully', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .send(correct);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });

    it('should create meetup with appropriate id', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .send(correct2);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });
});
