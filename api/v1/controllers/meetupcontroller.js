import { meetupStore } from '../datastore';
import Meetups from '../models/Meetups';

export default {
  createMeetup: (req, res) => {
    const meetupLength = meetupStore.length;
    req.body.id = meetupLength > 0 ? meetupStore[meetupLength - 1].id + 1 : 1;
    const meetup = new Meetups(req.body);
    meetupStore.push(meetup);
    return res.status(201).json({
      status: 201,
      message: 'Meetup created successfully.',
      data: [meetup],
    });
  },

  getOneMeetup: (req, res) => {
    const { id } = req.params;
    const foundMeetup = meetupStore.find(meetup => meetup.id === id);

    if (!foundMeetup) {
      return res.status(404).json({ status: 404, error: 'Meetup not found' });
    }
    return res.status(200).json({ status: 200, data: [foundMeetup] });
  },

  getAllMeetups: (req, res) => {
    if (meetupStore.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No meetups created yet.',
        data: [],
      });
    }
    return res.status(200).json({ status: 200, data: meetupStore });
  },

  getUpcomingMeetups: (req, res) => {
    const upcoming = meetupStore.filter(meetup => new Date(meetup.happeningOn) > new Date(Date.now()));
    if (upcoming.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No upcoming meetups found.',
        data: [],
      });
    }
    const sorted = upcoming.sort((older, newer) => {
      const olderDate = new Date(older.happeningOn);
      const newerDate = new Date(newer.happeningOn);
      return olderDate - newerDate;
    });
    return res.status(200).json({ status: 200, data: sorted });
  },
};
