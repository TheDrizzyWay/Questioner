import { meetupStore, rsvpStore } from '../datastore';
import trim from '../utils/trim';
import { goodResponse, badResponse } from '../utils/responses';

export default {
  respond: (req, res) => {
    const { id } = req.params;
    const rsvp = req.body;
    rsvp.response = trim(rsvp.response);
    const foundMeetup = meetupStore.find(meetup => meetup.id === parseInt(id, 10));

    if (!foundMeetup) return badResponse(res, 404, 'Meetup does not exist.');
    rsvp.id = id;
    rsvp.topic = foundMeetup.topic;
    rsvpStore.push(rsvp);

    return goodResponse(res, 200, 'Response recorded.', [rsvp]);
  },
};
