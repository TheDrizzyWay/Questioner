import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  missing, invalid, correct,
  correct2, invalidmeetup,
} from '../mockdata/questiondata';

chai.use(chaiHttp);

describe('Questions', () => {
  describe('GET /questions', () => {
    it('should return an empty array if no questions are found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/questions');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

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

    it('it should return 400 if meetup id is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .send(invalidmeetup);

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

    it('should create question with appropriate id', async () => {
      const res = await chai.request(app)
        .post('/api/v1/questions')
        .send(correct2);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /questions', () => {
    it('should get all questions and return 200', async () => {
      const res = await chai.request(app)
        .get('/api/v1/questions');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('GET /questions/:id', () => {
    it('should return 404 if id does not exist', async () => {
      const res = await chai.request(app)
        .get('/api/v1/questions/10');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 if request is successfull', async () => {
      const res = await chai.request(app)
        .get('/api/v1/questions/1');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('PATCH /questions/:id/upvote', () => {
    it('should return 404 if id does not exist', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/10/upvote');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 if request is successfull', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/questions/1/upvote');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });
});
