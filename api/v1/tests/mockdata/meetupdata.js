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
  topic: 'Aspiring software developers meetup2',
  location: 'The Bunker $%',
  image: 'http://sampleimage/image.jpg',
};

export {
  emptyMeetup, correctMeetup, wrongDate,
  invalidEdit, correctMeetup2, correctMeetup3,
};
