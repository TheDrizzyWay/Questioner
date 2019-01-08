import { meetupStore, rsvpStore } from '../datastore';

export default {
  respond: (req, res) => {
    const rsvp = req.body;
    const foundMeetup = meetupStore.find(meetup => meetup.id === parseInt(rsvp.meetup, 10));

    if (!foundMeetup) return res.status(404).json({ status: 404, error: 'Meetup does not exist.' });
    rsvp.topic = foundMeetup.topic;
    rsvpStore.push(rsvp);

    return res.status(200).json({
      status: 200,
      message: 'Response recorded.',
      data: [rsvp],
    });
  },
};
