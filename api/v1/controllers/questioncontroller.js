import { meetupStore, questionStore } from '../datastore';
import Questions from '../models/Questions';

export default {
  createQuestion: (req, res) => {
    const qLength = questionStore.length;
    req.body.id = qLength > 0 ? questionStore[qLength - 1].id + 1 : 1;
    const question = new Questions(req.body);
    const meetup = meetupStore.find(obj => obj.id === parseInt(question.meetup, 10));

    if (!meetup) return res.status(400).send({ status: 400, error: 'Meetup does not exist.' });
    questionStore.push(question);

    return res.status(201).send({
      status: 201,
      message: 'Question created successfully.',
      data: [question],
    });
  },

  getAllQuestions: (req, res) => {
    if (questionStore.length === 0) {
      return res.status(200).send({
        status: 200,
        message: 'No questions available yet.',
        data: [],
      });
    }
    return res.status(200).send({ status: 200, data: questionStore });
  },

  getOneQuestion: (req, res) => {
    const { id } = req.params;
    const question = questionStore.find(obj => obj.id === id);

    if (!question) {
      return res.status(404).send({ status: 404, error: 'Question not found' });
    }
    return res.status(200).send({ status: 200, data: [question] });
  },

  upvoteQuestion: (req, res) => {
    const { id } = req.params;
    const question = questionStore.find(obj => obj.id === id);

    if (!question) {
      return res.status(404).send({ status: 404, error: 'Question not found' });
    }
    question.votes += 1;
    return res.status(200).send({ status: 200, data: [question] });
  },

  downvoteQuestion: (req, res) => {
    const { id } = req.params;
    const question = questionStore.find(obj => obj.id === id);

    if (!question) {
      return res.status(404).send({ status: 404, error: 'Question not found' });
    }
    question.votes -= 1;
    return res.status(200).send({ status: 200, data: [question] });
  },
};
