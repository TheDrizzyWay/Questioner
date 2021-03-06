const missing = {
  meetup: '',
  title: '',
  body: '',
  createdBy: '',
};

const invalid = {
  meetup: 'abc',
  title: 'title',
  body: 'body',
  createdBy: 'abc',
};

const correct = {
  meetup: '1',
  title: 'title',
  body: 'body',
  createdBy: '1',
};

const correct2 = {
  meetup: '1',
  title: 'title',
  body: 'body',
  createdBy: '2',
};

const invalidmeetup = {
  meetup: '5',
  title: 'title',
  body: 'body',
  createdBy: '3',
};

export {
  missing, invalid, correct,
  correct2, invalidmeetup,
};
