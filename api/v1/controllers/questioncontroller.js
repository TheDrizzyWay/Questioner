import { meetupStore, questionStore } from '../datastore';
import Questions from '../models/Questions';

export default {
  createQuestion: (req, res) => {
    const questionLength = questionStore.length;
    req.body.id = questionLength > 0 ? questionStore[questionLength - 1].id + 1 : 1;
    const question = new Questions(req.body);
    const foundMeetup = meetupStore.find(meetup => meetup.id === parseInt(question.meetup, 10));

    if (!foundMeetup) return res.status(400).json({ status: 400, error: 'Meetup does not exist.' });
    questionStore.push(question);

    return res.status(201).json({
      status: 201,
      message: 'Question created successfully.',
      data: [question],
    });
  },

  getAllQuestions: (req, res) => {
    if (questionStore.length === 0) {
      return res.status(200).json({
        status: 200,
        message: 'No questions available yet.',
        data: [],
      });
    }
    return res.status(200).json({ status: 200, data: questionStore });
  },

  getOneQuestion: (req, res) => {
    const { id } = req.params;
    const foundQuestion = questionStore.find(question => question.id === id);

    if (!foundQuestion) {
      return res.status(404).json({ status: 404, error: 'Question not found' });
    }
    return res.status(200).json({ status: 200, data: [foundQuestion] });
  },

  upvoteQuestion: (req, res) => {
    const { id } = req.params;
    const foundQuestion = questionStore.find(question => question.id === id);

    if (!foundQuestion) {
      return res.status(404).json({ status: 404, error: 'Question not found' });
    }
    foundQuestion.votes += 1;
    return res.status(200).json({ status: 200, data: [foundQuestion] });
  },

  downvoteQuestion: (req, res) => {
    const { id } = req.params;
    const foundQuestion = questionStore.find(question => question.id === id);

    if (!foundQuestion) {
      return res.status(404).json({ status: 404, error: 'Question not found' });
    }
    foundQuestion.votes -= 1;
    return res.status(200).json({ status: 200, data: [foundQuestion] });
  },
};
