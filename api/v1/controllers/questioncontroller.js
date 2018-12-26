import { questionStore } from '../datastore';
import Questions from '../models/Questions';

export default {
  createQuestion: (req, res) => {
    const qLength = questionStore.length;
    req.body.id = qLength > 0 ? questionStore[qLength - 1].id + 1 : 1;
    const question = new Questions(req.body);
    questionStore.push(question);
    return res.status(201).send({
      status: 201,
      message: 'Question created successfully.',
      data: [question],
    });
  },
};
