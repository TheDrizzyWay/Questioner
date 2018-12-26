import moment from 'moment';

export default class Questions {
  constructor(question) {
    this.id = question.id;
    this.meetup = question.meetup;
    this.title = question.title;
    this.body = question.body;
    this.votes = 0;
    this.createdBy = question.createdBy;
    this.createdOn = moment();
  }
}
