import { meetupStore, rsvpStore } from '../datastore';

export default {
  respond: (req, res) => {
    const rsvp = req.body;
    const meetup = meetupStore.find(obj => obj.id === parseInt(rsvp.meetup, 10));

    if (!meetup) return res.status(404).send({ status: 404, error: 'Meetup does not exist.' });
    rsvp.topic = meetup.topic;
    rsvpStore.push(rsvp);

    return res.status(200).send({
      status: 200,
      message: 'Response recorded.',
      data: [rsvp],
    });
  },
};
