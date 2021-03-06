import moment from 'moment';

export default class Meetups {
  constructor(meetup) {
    this.id = meetup.id;
    this.topic = meetup.topic;
    this.location = meetup.location;
    this.happeningOn = meetup.happeningOn;
    this.images = meetup.images ? meetup.images : [];
    this.tags = meetup.tags ? meetup.tags : [];
    this.createdOn = moment().toISOString().replace('T', ' by ').replace('Z', '');
  }
}
