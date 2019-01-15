import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import { userLogin } from '../mockdata/userdata';

chai.use(chaiHttp);
let userToken;

describe('Rsvps', () => {
  before(async () => {
    const userResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userLogin);

    userToken = userResponse.body.data;
  });

  describe('POST /:meetupid/rsvps', () => {
    it('should return 400 for missing response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: '' });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 400 for invalid response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'wrong' });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should return 404 if meetup does not exist', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/10/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'yes' });
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error');
    });

    it('should return 200 for successfull response', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'Yes' });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });

    it('should return 400 if user already responded', async () => {
      const res = await chai.request(app)
        .post('/api/v1/meetups/1/rsvps')
        .set({ Authorization: `Bearer ${userToken}` })
        .send({ response: 'Yes' });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });
});
