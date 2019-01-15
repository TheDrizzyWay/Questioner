import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { correctLogin, userLogin } from '../mockdata/userdata';
import { emptyMeetup, wrongDate, correctMeetup } from '../mockdata/meetupdata';

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
  });
});
