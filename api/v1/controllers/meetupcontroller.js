import { meetupStore } from '../datastore';
import Meetups from '../models/Meetups';
import trim from '../utils/trim';
import { goodResponse, badResponse } from '../utils/responses';

export default {
  createMeetup: (req, res) => {
    const meetupLength = meetupStore.length;
    req.body.id = meetupLength > 0 ? meetupStore[meetupLength - 1].id + 1 : 1;
    const meetup = new Meetups(req.body);

    meetup.topic = trim(meetup.topic);
    meetup.location = trim(meetup.location);
    meetup.happeningOn = trim(meetup.happeningOn);

    meetupStore.push(meetup);
    goodResponse(res, 201, 'Meetup created successfully.', [meetup]);
  },

  getOneMeetup: (req, res) => {
    const { id } = req.params;
    const foundMeetup = meetupStore.find(meetup => meetup.id === id);

    if (!foundMeetup) {
      return badResponse(res, 404, 'Meetup not found');
    }
    return res.status(200).json({ status: 200, data: [foundMeetup] });
  },

  getAllMeetups: (req, res) => {
    if (meetupStore.length === 0) {
      return goodResponse(res, 200, 'No meetups created yet.', []);
    }
    return goodResponse(res, 200, null, meetupStore);
  },

  getUpcomingMeetups: (req, res) => {
    const upcoming = meetupStore.filter(meetup => new Date(meetup.happeningOn) > new Date(Date.now()));
    if (upcoming.length === 0) {
      return goodResponse(res, 200, 'No upcoming meetups found.', []);
    }
    const sorted = upcoming.sort((older, newer) => {
      const olderDate = new Date(older.happeningOn);
      const newerDate = new Date(newer.happeningOn);
      return olderDate - newerDate;
    });
    return goodResponse(res, 200, null, sorted);
  },
};
