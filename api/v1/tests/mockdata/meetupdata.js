const emptyMeetup = {
  topic: '',
  location: '',
  happeningon: '',
};

const correctMeetup = {
  topic: 'Aspiring software developers meetup',
  location: 'The Bunker $%',
  happeningon: '2025-01-16T22:00',
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
  happeningon: '2025-01-13T22:00',
  image: 'http://sampleimage/image.jpg',
  tags: ['123', '123'],
};

const correctMeetup3 = {
  happeningon: '2020-01-13T22:00',
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
  happeningon: '2020-01-13T22:00',
  image: 'http://sampleimage/image.jpg',
  tags: ['sports', 'soccer'],
};

export {
  emptyMeetup, correctMeetup, wrongDate,
  invalidEdit, correctMeetup2, correctMeetup3,
  correctMeetup4, correctMeetup5,
};
