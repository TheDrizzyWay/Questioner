const today = new Date();
const tomorrow = new Date();
const dayAfter = new Date();
tomorrow.setDate(today.getDate() + 1);
const tomorrowString = tomorrow.toISOString();
const tomorrowFormat = tomorrowString.substring(0, 16);
dayAfter.setDate(today.getDate() + 3);
const dayAfterString = dayAfter.toISOString();
const dayAfterFormat = dayAfterString.substring(0, 16);

const emptyMeetup = {
  topic: '',
  location: '',
  happeningon: '',
};

const correctMeetup = {
  topic: 'Aspiring software developers meetup',
  location: 'The Bunker $%',
  happeningon: tomorrowFormat,
  image: 'http://sampleimage/image.jpg',
  tags: ['123', '123'],
};

const wrongDate = {
  topic: 'Aspiring software developers meetup',
  location: 'The Bunker $%',
  happeningon: '2019-01-13T22:00',
};

const invalidEdit = {
  topic: 'a',
  location: 'a',
  happeningon: '123',
};

const correctMeetup2 = {
  topic: 'Aspiring software developers meetup',
  location: 'The Bunker $%',
  happeningon: dayAfterFormat,
  image: 'http://sampleimage/image.jpg',
  tags: ['123', '123'],
};

const correctMeetup3 = {
  happeningon: tomorrowFormat,
  location: 'new location',
  image: 'http://sampleimage/image2.jpg',
};

const correctMeetup5 = {
  topic: 'new topic 2',
  tags: ['abc', 'abc'],
};

const correctMeetup4 = {
  topic: 'Sports fans meetup',
  location: 'Emirates stadium',
  happeningon: tomorrowFormat,
  image: 'http://sampleimage/image.jpg',
  tags: ['sports', 'soccer'],
};

export {
  emptyMeetup, correctMeetup, wrongDate,
  invalidEdit, correctMeetup2, correctMeetup3,
  correctMeetup4, correctMeetup5,
};
