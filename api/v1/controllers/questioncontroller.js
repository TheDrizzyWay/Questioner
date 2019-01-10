import { meetupStore, questionStore } from '../datastore';
import Questions from '../models/Questions';
import trim from '../utils/trim';
import { goodResponse, badResponse } from '../utils/responses';

export default {
  createQuestion: (req, res) => {
    const questionLength = questionStore.length;
    req.body.id = questionLength > 0 ? questionStore[questionLength - 1].id + 1 : 1;
    const question = new Questions(req.body);

    question.title = trim(question.title);
    question.body = trim(question.body);

    const foundMeetup = meetupStore.find(meetup => meetup.id === parseInt(question.meetup, 10));
    if (!foundMeetup) return badResponse(res, 400, 'Meetup does not exist.');

    questionStore.push(question);

    return goodResponse(res, 201, 'Question created successfully.', [question]);
  },

  getAllQuestions: (req, res) => {
    if (questionStore.length === 0) {
      return goodResponse(res, 200, 'No questions available yet.', []);
    }
    return goodResponse(res, 200, null, questionStore);
  },

  getOneQuestion: (req, res) => {
    const { id } = req.params;
    const foundQuestion = questionStore.find(question => question.id === id);

    if (!foundQuestion) {
      return badResponse(res, 404, 'Question not found');
    }
    return goodResponse(res, 200, null, [foundQuestion]);
  },

  upvoteQuestion: (req, res) => {
    const { id } = req.params;
    const foundQuestion = questionStore.find(question => question.id === id);

    if (!foundQuestion) {
      return badResponse(res, 404, 'Question not found');
    }
    foundQuestion.votes += 1;
    return goodResponse(res, 200, null, [foundQuestion]);
  },

  downvoteQuestion: (req, res) => {
    const { id } = req.params;
    const foundQuestion = questionStore.find(question => question.id === id);

    if (!foundQuestion) {
      return badResponse(res, 404, 'Question not found');
    }
    foundQuestion.votes -= 1;
    return goodResponse(res, 200, null, [foundQuestion]);
  },
};
