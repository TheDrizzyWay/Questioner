import { meetupStore } from '../datastore';
import Meetups from '../models/Meetups';

export default {
  createMeetup: (req, res) => {
    const mLength = meetupStore.length;
    req.body.id = mLength > 0 ? meetupStore[mLength - 1].id + 1 : 1;
    const meetup = new Meetups(req.body);
    meetupStore.push(meetup);
    return res.status(201).send({
      status: 201,
      message: 'Meetup created successfully.',
      data: [meetup],
    });
  },

  getOneMeetup: (req, res) => {
    const { id } = req.params;
    const meetup = meetupStore.find(obj => obj.id === id);

    if (!meetup) {
      return res.status(404).send({ status: 404, error: 'Meetup not found' });
    }
    return res.status(200).send({ status: 200, data: [meetup] });
  },
};
