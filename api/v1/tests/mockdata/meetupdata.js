const emptyMeetup = {
  topic: '',
  location: '',
  happeningon: '',
};

const correctMeetup = {
  topic: 'Aspiring software developers meetup',
  location: 'The Bunker $%',
  happeningon: '2019-01-16T22:00',
  image: 'http://sampleimage/image.jpg',
  tags: ['123', '123'],
};

const wrongDate = {
  topic: 'Aspiring software developers meetup',
  location: 'The Bunker $%',
  happeningon: '2019-01-13T22:00',
};

export {
  emptyMeetup, correctMeetup, wrongDate,
};
